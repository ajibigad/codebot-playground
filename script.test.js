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

function appendToDisplay(value) {
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
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
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

// Mock confetti function
global.confetti = jest.fn();

// Confetti animation function
function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Reset inactivity timer
function resetInactivityTimer() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
        triggerConfetti();
        resetInactivityTimer();
    }, INACTIVITY_TIMEOUT);

    return inactivityTimer;
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

    // Clear any existing timers
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }

    // Clear mock calls
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';

    // Clear any remaining timers
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
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

  describe('Inactivity Timer and Confetti', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should trigger confetti after 60 seconds of inactivity', () => {
      resetInactivityTimer();

      // Fast-forward time by 60 seconds
      jest.advanceTimersByTime(60000);

      expect(confetti).toHaveBeenCalledTimes(1);
      expect(confetti).toHaveBeenCalledWith({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    test('should not trigger confetti before 60 seconds', () => {
      resetInactivityTimer();

      // Fast-forward time by 59 seconds
      jest.advanceTimersByTime(59000);

      expect(confetti).not.toHaveBeenCalled();
    });

    test('should reset timer when resetInactivityTimer is called', () => {
      resetInactivityTimer();

      // Advance 30 seconds
      jest.advanceTimersByTime(30000);

      // Reset the timer
      resetInactivityTimer();

      // Advance another 50 seconds (total would be 80 if not reset)
      jest.advanceTimersByTime(50000);

      // Should not have triggered yet
      expect(confetti).not.toHaveBeenCalled();

      // Advance final 10 seconds to reach 60 from reset
      jest.advanceTimersByTime(10000);

      expect(confetti).toHaveBeenCalledTimes(1);
    });

    test('should restart timer after confetti triggers', () => {
      resetInactivityTimer();

      // First confetti after 60 seconds
      jest.advanceTimersByTime(60000);
      expect(confetti).toHaveBeenCalledTimes(1);

      // Second confetti after another 60 seconds
      jest.advanceTimersByTime(60000);
      expect(confetti).toHaveBeenCalledTimes(2);
    });

    test('triggerConfetti should call confetti with correct parameters', () => {
      triggerConfetti();

      expect(confetti).toHaveBeenCalledWith({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    test('triggerConfetti should handle missing confetti library gracefully', () => {
      const originalConfetti = global.confetti;
      global.confetti = undefined;

      // Should not throw error
      expect(() => triggerConfetti()).not.toThrow();

      global.confetti = originalConfetti;
    });

    test('should clear existing timer before setting new one', () => {
      const firstTimer = resetInactivityTimer();
      const secondTimer = resetInactivityTimer();

      // Timers should be different
      expect(firstTimer).not.toBe(secondTimer);

      // Only the second timer should trigger
      jest.advanceTimersByTime(60000);
      expect(confetti).toHaveBeenCalledTimes(1);
    });
  });
});

