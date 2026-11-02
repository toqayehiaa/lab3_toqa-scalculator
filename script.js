// DOM: select the nodes we need
const display = document.getElementById('display');
const buttons = document.getElementById('buttons');

// the calculator's memory
let current = '0';       // number on the screen
let previous = null;     // first number, saved when an operator is pressed
let operator = null;     // + - * /
let resetNext = false;   // true when the next digit should start a new number

// Logic: functions
function updateDisplay() {
  display.textContent = current;
}

function appendNumber(num) {
  // start fresh after an operator, an equals or an error
  if (resetNext || current === 'Error') {
    current = '0';
    resetNext = false;
  }

  // only one dot allowed in a number
  if (num === '.' && current.includes('.')) return;

  if (current === '0' && num !== '.') {
    // replace the starting 0 (this also makes 00 stay as 0)
    current = num === '00' ? '0' : num;
  } else {
    current += num;
  }
}

function chooseOperator(op) {
  if (current === 'Error') return;

  // if an operation is already waiting, finish it first (like 2 + 3 + 4)
  if (operator !== null && !resetNext) {
    calculate();
  }

  previous = current;
  operator = op;
  resetNext = true;
}

function calculate() {
  if (operator === null || current === 'Error') return;

  const a = Number(previous);
  const b = Number(current);
  let result;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      result = b === 0 ? 'Error' : a / b;
      break;
  }

  // toFixed fixes things like 0.1 + 0.2 = 0.30000000000000004
  current = result === 'Error' ? 'Error' : String(Number(result.toFixed(8)));
  operator = null;
  previous = null;
  resetNext = true;
}

function percent() {
  if (current === 'Error') return;
  current = String(Number(current) / 100);
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resetNext = false;
}

// Event: one listener on the parent (delegation) instead of one per button
buttons.addEventListener('click', (e) => {
  if (e.target.nodeName !== 'BUTTON') return;

  const btn = e.target;

  if (btn.dataset.number !== undefined) {
    appendNumber(btn.dataset.number);
  } else if (btn.dataset.operator !== undefined) {
    chooseOperator(btn.dataset.operator);
  } else if (btn.dataset.action === 'equals') {
    calculate();
  } else if (btn.dataset.action === 'percent') {
    percent();
  } else if (btn.dataset.action === 'clear') {
    clearAll();
  }

  updateDisplay();
});
