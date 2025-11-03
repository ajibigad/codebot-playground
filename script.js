let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Inactivity timer for confetti
let inactivityTimer = null;
let countdownInterval = null;
let countdownEndTime = null;

// Function to update countdown display
function updateCountdown() {
    const now = Date.now();
    const timeRemaining = Math.max(0, Math.ceil((countdownEndTime - now) / 1000));

    const countdownElement = document.getElementById('countdown-value');
    if (countdownElement) {
        countdownElement.textContent = timeRemaining;
    }

    if (timeRemaining === 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Function to start countdown display
function startCountdown(durationMs) {
    // Clear any existing countdown interval
    if (countdownInterval !== null) {
        clearInterval(countdownInterval);
    }

    // Set the end time
    countdownEndTime = Date.now() + durationMs;

    // Update immediately
    updateCountdown();

    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Function to get random timeout between 10-60 seconds
function getRandomTimeout() {
    // Random timeout between 10000ms (10s) and 60000ms (60s)
    randomTimeout = Math.floor(Math.random() * 50001) + 10000;
    console.log("Random timeout", randomTimeout);

    return randomTimeout;
}

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
    // Reset timer after confetti to trigger again at random intervals
    resetInactivityTimer();
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    // Clear existing timer
    if (inactivityTimer !== null) {
        clearTimeout(inactivityTimer);
    }

    // Start new timer with random timeout
    const timeout = getRandomTimeout();
    inactivityTimer = setTimeout(() => {
        triggerConfetti();
    }, timeout);

    // Start countdown display
    startCountdown(timeout);
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
