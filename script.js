let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Inactivity timer variables
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 60000; // 60 seconds in milliseconds

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    if (value === '.' && display.value.includes('.')) {
        return; // Prevent multiple decimal points
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
        resetInactivityTimer(); // Restart timer after confetti
    }, INACTIVITY_TIMEOUT);
}

// Handle operator clicks
document.addEventListener('DOMContentLoaded', function() {
    const operatorButtons = document.querySelectorAll('.operator');

    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const op = this.textContent;

            if (op === '÷' || op === '×' || op === '+' || op === '-') {
                if (operator && previousInput && display.value) {
                    calculate();
                }

                previousInput = display.value;
                operator = op === '÷' ? '/' : op === '×' ? '*' : op;
                shouldResetDisplay = true;
            }
        });
    });

    // Initialize inactivity timer
    resetInactivityTimer();

    // Track user interactions on all buttons
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', resetInactivityTimer);
    });

    // Track keyboard interactions on display
    if (display) {
        display.addEventListener('focus', resetInactivityTimer);
        display.addEventListener('keydown', resetInactivityTimer);
    }
});
