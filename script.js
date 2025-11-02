let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Inactivity timer for confetti
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 60000; // 60 seconds in milliseconds

// Function to trigger confetti animation
function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        // Random particle count between 50 (less dramatic) and 200 (crazy dramatic)
        const randomParticleCount = Math.floor(Math.random() * 151) + 50;
        confetti({
            particleCount: randomParticleCount,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    // Clear existing timer
    if (inactivityTimer !== null) {
        clearTimeout(inactivityTimer);
    }

    // Start new timer
    inactivityTimer = setTimeout(() => {
        triggerConfetti();
    }, INACTIVITY_TIMEOUT);
}

function appendToDisplay(value) {
    resetInactivityTimer();
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

// Handle operator clicks
document.addEventListener('DOMContentLoaded', function() {
    const operatorButtons = document.querySelectorAll('.operator');

    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const op = this.textContent;

            if (op === '÷' || op === '×' || op === '+' || op === '-') {
                resetInactivityTimer();
                if (operator && previousInput && display.value) {
                    calculate();
                }

                previousInput = display.value;
                operator = op === '÷' ? '/' : op === '×' ? '*' : op;
                shouldResetDisplay = true;
            }
        });
    });

    // Initialize the inactivity timer when page loads
    resetInactivityTimer();
});
