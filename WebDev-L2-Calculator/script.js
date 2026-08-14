// Calculator Logic — Oasis Infobyte Web Dev Internship Level 2 Task 1

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
    resultEl.textContent = currentInput;
    expressionEl.textContent = previousInput;
}

function inputNumber(num) {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    if (num === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function chooseOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculate();
    }
    previousInput = `${currentInput} ${symbolFor(op)}`;
    operator = op;
    shouldResetScreen = true;
    updateDisplay();
}

function symbolFor(op) {
    switch (op) {
        case 'add': return '+';
        case 'subtract': return '−';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (operator) {
        case 'add':
            result = prev + curr;
            break;
        case 'subtract':
            result = prev - curr;
            break;
        case 'multiply':
            result = prev * curr;
            break;
        case 'divide':
            if (curr === 0) {
                currentInput = 'Error';
                previousInput = '';
                operator = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }

    currentInput = parseFloat(result.toFixed(8)).toString();
    operator = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function backspace() {
    if (currentInput.length === 1 || currentInput === 'Error') {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function percent() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const num = button.getAttribute('data-num');
        const action = button.getAttribute('data-action');

        if (num !== null) {
            inputNumber(num);
        } else if (action === 'clear') {
            clearAll();
        } else if (action === 'backspace') {
            backspace();
        } else if (action === 'percent') {
            percent();
        } else if (action === 'equals') {
            calculate();
        } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
            chooseOperator(action);
        }
    });
});

updateDisplay();