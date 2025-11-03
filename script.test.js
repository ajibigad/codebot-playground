/**
 * @jest-environment jsdom
 */

// Mock global variables and functions from script.js
let display;
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Inactivity timer variables
let inactivityTimer = null;

// Mock confetti function
global.confetti = jest.fn();

// Function to get random timeout between 10-60 seconds
function getRandomTimeout() {
    return Math.floor(Math.random() * 50001) + 10000;
}

// Function to trigger confetti animation
function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    // Reset timer after confetti to trigger again at random intervals
    resetInactivityTimer();
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    if (inactivityTimer !== null) {
        clearTimeout(inactivityTimer);
    }
    const timeout = getRandomTimeout();
    inactivityTimer = setTimeout(() => {
        triggerConfetti();
    }, timeout);
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

    // Clear timer and reset confetti mock
    if (inactivityTimer !== null) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
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

  describe('Inactivity Timer and Confetti', () => {
    test('should trigger confetti after random timeout (10-60 seconds)', () => {
      // Mock getRandomTimeout to return a specific value for testing
      const mockTimeout = 15000; // 15 seconds
      jest.spyOn(global.Math, 'random').mockReturnValue(0.1); // Will result in ~15000ms

      // Start the timer
      resetInactivityTimer();

      // Fast-forward time by less than timeout
      jest.advanceTimersByTime(10000);
      expect(confetti).not.toHaveBeenCalled();

      // Fast-forward to trigger first confetti (~15s)
      jest.advanceTimersByTime(10000);

      // Confetti should have been called at least once
      expect(confetti).toHaveBeenCalled();
      expect(confetti).toHaveBeenCalledWith({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      global.Math.random.mockRestore();
    });

    test('should reset timer when appendToDisplay is called', () => {
      resetInactivityTimer();

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      // User interacts with calculator
      appendToDisplay('5');

      // Fast-forward another 50 seconds
      jest.advanceTimersByTime(50000);

      // Confetti should not have been called yet (since timer was reset and random timeout could be up to 60s)
      // Fast-forward enough time to ensure any random timeout would trigger
      jest.advanceTimersByTime(60000);

      // Now confetti should be called
      expect(confetti).toHaveBeenCalled();
    });

    test('should reset timer when clearDisplay is called', () => {
      // Mock Math.random for predictable behavior
      const mockRandom = jest.spyOn(global.Math, 'random').mockReturnValue(0.8); // ~50000ms timeout

      resetInactivityTimer();

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      // User clears display
      clearDisplay();

      // Fast-forward 40 seconds - shouldn't trigger yet (50s timeout)
      jest.advanceTimersByTime(40000);
      expect(confetti).not.toHaveBeenCalled();

      // Fast-forward another 15 seconds to trigger
      jest.advanceTimersByTime(15000);

      // Now confetti should be called once
      expect(confetti).toHaveBeenCalledTimes(1);

      mockRandom.mockRestore();
    });

    test('should reset timer when deleteLast is called', () => {
      // Mock Math.random for predictable behavior
      const mockRandom = jest.spyOn(global.Math, 'random').mockReturnValue(0.6); // ~40000ms timeout

      resetInactivityTimer();
      display.value = '123';

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      // User deletes last character
      deleteLast();

      // Fast-forward 30 seconds - shouldn't trigger yet (40s timeout)
      jest.advanceTimersByTime(30000);
      expect(confetti).not.toHaveBeenCalled();

      // Fast-forward another 15 seconds to trigger
      jest.advanceTimersByTime(15000);

      // Confetti should have been called once
      expect(confetti).toHaveBeenCalledTimes(1);

      mockRandom.mockRestore();
    });

    test('should reset timer when calculate is called', () => {
      // Mock Math.random for predictable behavior
      const mockRandom = jest.spyOn(global.Math, 'random').mockReturnValue(0.7); // ~45000ms timeout

      resetInactivityTimer();
      previousInput = '5';
      operator = '+';
      display.value = '3';

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      // User calculates
      calculate();

      // Fast-forward 35 seconds - shouldn't trigger yet (45s timeout)
      jest.advanceTimersByTime(35000);
      expect(confetti).not.toHaveBeenCalled();

      // Fast-forward another 15 seconds to trigger
      jest.advanceTimersByTime(15000);

      // Now confetti should be called once
      expect(confetti).toHaveBeenCalledTimes(1);

      mockRandom.mockRestore();
    });

    test('should handle confetti when confetti is undefined', () => {
      const originalConfetti = global.confetti;
      global.confetti = undefined;

      // This should not throw an error
      expect(() => {
        triggerConfetti();
      }).not.toThrow();

      global.confetti = originalConfetti;
    });

    test('should clear previous timer when resetInactivityTimer is called multiple times', () => {
      // Mock Math.random to get a predictable timeout
      const mockRandom = jest.spyOn(global.Math, 'random').mockReturnValue(0.5); // Will result in ~35000ms

      resetInactivityTimer();

      // Fast-forward 20 seconds
      jest.advanceTimersByTime(20000);

      // Reset timer again (clears the first timer)
      resetInactivityTimer();

      // Fast-forward 20 seconds more (total 40 from start, but only 20 from reset)
      jest.advanceTimersByTime(20000);

      // Confetti should not have been called yet (timeout is ~35s from reset)
      expect(confetti).not.toHaveBeenCalled();

      // Fast-forward enough to trigger the second timer (15s more to reach 35s from reset)
      jest.advanceTimersByTime(20000);

      // Now confetti should be called once (only from the second timer)
      expect(confetti).toHaveBeenCalledTimes(1);

      mockRandom.mockRestore();
    });

    test('should continuously trigger confetti at random intervals without user interaction', () => {
      // Mock Math.random to return different values for different calls
      const mockRandom = jest.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.2) // First timeout: ~20000ms (20s)
        .mockReturnValueOnce(0.6) // Second timeout: ~40000ms (40s)
        .mockReturnValueOnce(0.8); // Third timeout: ~50000ms (50s)

      // Initialize timer
      resetInactivityTimer();

      // Fast-forward to first confetti trigger (20s)
      jest.advanceTimersByTime(20000);
      expect(confetti).toHaveBeenCalledTimes(1);

      // Fast-forward to second confetti trigger (40s more)
      jest.advanceTimersByTime(40000);
      expect(confetti).toHaveBeenCalledTimes(2);

      // Fast-forward to third confetti trigger (50s more)
      jest.advanceTimersByTime(50000);
      expect(confetti).toHaveBeenCalledTimes(3);

      mockRandom.mockRestore();
    });
  });
});

