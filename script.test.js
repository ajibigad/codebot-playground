/**
 * @jest-environment jsdom
 */

// Mock global variables and functions from script.js
let display;
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 60000;

// Mock confetti function
global.confetti = jest.fn();

function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function resetInactivityTimer() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
        triggerConfetti();
        resetInactivityTimer();
    }, INACTIVITY_TIMEOUT);
}

function appendToDisplay(value) {
    resetInactivityTimer();

    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }

    if (value === '.' && display.value.includes('.')) {
        return;
    }

    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    resetInactivityTimer();
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    resetInactivityTimer();
    display.value = display.value.slice(0, -1);
}

function calculate() {
    resetInactivityTimer();

    if (operator && previousInput && display.value) {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(display.value);

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    display.value = 'Error';
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        display.value = result.toString();
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
    }
}

describe('Calculator Tests', () => {
  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = `
      <input type="text" id="result" readonly>
    `;

    display = document.getElementById('result');
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    inactivityTimer = null;
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('appendToDisplay', () => {
    test('should append single digit to empty display', () => {
      appendToDisplay('5');
      expect(display.value).toBe('5');
    });

    test('should append multiple digits', () => {
      appendToDisplay('1');
      appendToDisplay('2');
      appendToDisplay('3');
      expect(display.value).toBe('123');
    });

    test('should handle decimal point', () => {
      appendToDisplay('5');
      appendToDisplay('.');
      appendToDisplay('5');
      expect(display.value).toBe('5.5');
    });

    test('should prevent multiple decimal points', () => {
      appendToDisplay('5');
      appendToDisplay('.');
      appendToDisplay('5');
      appendToDisplay('.');
      expect(display.value).toBe('5.5');
    });

    test('should replace leading zero when adding non-decimal digit', () => {
      display.value = '0';
      appendToDisplay('5');
      expect(display.value).toBe('5');
    });

    test('should allow decimal after leading zero', () => {
      display.value = '0';
      appendToDisplay('.');
      expect(display.value).toBe('0.');
    });
  });

  describe('clearDisplay', () => {
    test('should clear display and reset all variables', () => {
      display.value = '123';
      clearDisplay();
      expect(display.value).toBe('');
    });

    test('should clear display after calculation', () => {
      display.value = '42';
      clearDisplay();
      expect(display.value).toBe('');
    });
  });

  describe('deleteLast', () => {
    test('should delete last character', () => {
      display.value = '123';
      deleteLast();
      expect(display.value).toBe('12');
    });

    test('should handle empty display', () => {
      display.value = '';
      deleteLast();
      expect(display.value).toBe('');
    });

    test('should delete until display is empty', () => {
      display.value = '5';
      deleteLast();
      expect(display.value).toBe('');
    });
  });

  describe('calculate - Addition', () => {
    test('should add two positive numbers', () => {
      previousInput = '5';
      operator = '+';
      display.value = '3';
      calculate();
      expect(display.value).toBe('8');
    });

    test('should add decimal numbers', () => {
      previousInput = '5.5';
      operator = '+';
      display.value = '2.3';
      calculate();
      expect(display.value).toBe('7.8');
    });

    test('should add negative and positive', () => {
      previousInput = '-5';
      operator = '+';
      display.value = '10';
      calculate();
      expect(display.value).toBe('5');
    });
  });

  describe('calculate - Subtraction', () => {
    test('should subtract two numbers', () => {
      previousInput = '10';
      operator = '-';
      display.value = '3';
      calculate();
      expect(display.value).toBe('7');
    });

    test('should handle negative results', () => {
      previousInput = '3';
      operator = '-';
      display.value = '10';
      calculate();
      expect(display.value).toBe('-7');
    });

    test('should subtract decimal numbers', () => {
      previousInput = '10.5';
      operator = '-';
      display.value = '2.3';
      calculate();
      expect(display.value).toBe('8.2');
    });
  });

  describe('calculate - Multiplication', () => {
    test('should multiply two positive numbers', () => {
      previousInput = '5';
      operator = '*';
      display.value = '3';
      calculate();
      expect(display.value).toBe('15');
    });

    test('should multiply decimal numbers', () => {
      previousInput = '2.5';
      operator = '*';
      display.value = '4';
      calculate();
      expect(display.value).toBe('10');
    });

    test('should handle multiplication by zero', () => {
      previousInput = '5';
      operator = '*';
      display.value = '0';
      calculate();
      expect(display.value).toBe('0');
    });

    test('should handle negative multiplication', () => {
      previousInput = '-5';
      operator = '*';
      display.value = '3';
      calculate();
      expect(display.value).toBe('-15');
    });
  });

  describe('calculate - Division', () => {
    test('should divide two numbers', () => {
      previousInput = '10';
      operator = '/';
      display.value = '2';
      calculate();
      expect(display.value).toBe('5');
    });

    test('should handle division with decimal result', () => {
      previousInput = '10';
      operator = '/';
      display.value = '3';
      calculate();
      expect(parseFloat(display.value)).toBeCloseTo(3.333333, 5);
    });

    test('should show Error when dividing by zero', () => {
      previousInput = '10';
      operator = '/';
      display.value = '0';
      calculate();
      expect(display.value).toBe('Error');
    });

    test('should divide decimal numbers', () => {
      previousInput = '7.5';
      operator = '/';
      display.value = '2.5';
      calculate();
      expect(display.value).toBe('3');
    });
  });

  describe('Edge Cases', () => {
    test('should not calculate without operator', () => {
      previousInput = '5';
      operator = '';
      display.value = '3';
      const initialValue = display.value;
      calculate();
      expect(display.value).toBe(initialValue);
    });

    test('should not calculate without previous input', () => {
      previousInput = '';
      operator = '+';
      display.value = '3';
      const initialValue = display.value;
      calculate();
      expect(display.value).toBe(initialValue);
    });

    test('should not calculate with empty display', () => {
      previousInput = '5';
      operator = '+';
      display.value = '';
      calculate();
      expect(display.value).toBe('');
    });

    test('should handle very large numbers', () => {
      previousInput = '999999999';
      operator = '+';
      display.value = '1';
      calculate();
      expect(display.value).toBe('1000000000');
    });

    test('should handle very small decimal numbers', () => {
      previousInput = '0.1';
      operator = '+';
      display.value = '0.2';
      calculate();
      expect(parseFloat(display.value)).toBeCloseTo(0.3, 10);
    });
  });

  describe('Confetti Inactivity Feature', () => {
    test('should trigger confetti after 60 seconds of inactivity', () => {
      resetInactivityTimer();

      expect(confetti).not.toHaveBeenCalled();

      jest.advanceTimersByTime(60000);

      expect(confetti).toHaveBeenCalledWith({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    test('should not trigger confetti before 60 seconds', () => {
      resetInactivityTimer();

      jest.advanceTimersByTime(59999);

      expect(confetti).not.toHaveBeenCalled();
    });

    test('should reset timer when appendToDisplay is called', () => {
      resetInactivityTimer();

      jest.advanceTimersByTime(30000);
      appendToDisplay('5');

      jest.advanceTimersByTime(30000);
      expect(confetti).not.toHaveBeenCalled();

      jest.advanceTimersByTime(30000);
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    test('should reset timer when clearDisplay is called', () => {
      resetInactivityTimer();

      jest.advanceTimersByTime(50000);
      clearDisplay();

      jest.advanceTimersByTime(50000);
      expect(confetti).not.toHaveBeenCalled();

      jest.advanceTimersByTime(10000);
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    test('should reset timer when deleteLast is called', () => {
      resetInactivityTimer();
      display.value = '123';

      jest.advanceTimersByTime(40000);
      deleteLast();

      jest.advanceTimersByTime(40000);
      expect(confetti).not.toHaveBeenCalled();

      jest.advanceTimersByTime(20000);
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    test('should reset timer when calculate is called', () => {
      resetInactivityTimer();
      previousInput = '5';
      operator = '+';
      display.value = '3';

      jest.advanceTimersByTime(45000);
      calculate();

      jest.advanceTimersByTime(45000);
      expect(confetti).not.toHaveBeenCalled();

      jest.advanceTimersByTime(15000);
      expect(confetti).toHaveBeenCalledTimes(1);
    });

    test('should continue triggering confetti every 60 seconds if no interaction', () => {
      resetInactivityTimer();

      jest.advanceTimersByTime(60000);
      expect(confetti).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(60000);
      expect(confetti).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(60000);
      expect(confetti).toHaveBeenCalledTimes(3);
    });

    test('triggerConfetti should not throw error when confetti is undefined', () => {
      const originalConfetti = global.confetti;
      global.confetti = undefined;

      expect(() => triggerConfetti()).not.toThrow();

      global.confetti = originalConfetti;
    });

    test('should clear existing timer when resetting', () => {
      resetInactivityTimer();
      const firstTimer = inactivityTimer;

      resetInactivityTimer();
      const secondTimer = inactivityTimer;

      expect(firstTimer).not.toBe(secondTimer);
    });
  });
});

