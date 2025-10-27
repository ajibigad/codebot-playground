let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

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
});
