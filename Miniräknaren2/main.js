import {
  add,
  divide,
  multiply,
  square,
  squareRoot,
  subtract,
} from './js/calculations.js';

const num1Display = document.querySelector('.display-text-num1');
const operatorDisplay = document.querySelector('.display-text-operator');
const num2Display = document.querySelector('.display-text-num2');
const resultDisplay = document.querySelector('.display-text-result');
const buttonGrid = document.querySelector('.button-grid');
const historyList = document.querySelector('.history ol');
const buttonsToGenerate = [
  'C',
  '√',
  'X^2',
  '+',
  '7',
  '8',
  '9',
  '-',
  '4',
  '5',
  '6',
  '*',
  '1',
  '2',
  '3',
  '/',
  '',
  '0',
  'M1',
  'M2',
];

let num1Filled = false;
let showDigits = true;

function createButtons() {
  buttonsToGenerate.forEach((button) => {
    const newButton = document.createElement('button');
    const operators = ['+', '-', '*', '/', 'X^2', '√'];
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    newButton.innerText = button;
    if (operators.includes(newButton.innerText)) {
      newButton.className = 'operator';
    } else if (digits.includes(newButton.innerText)) {
      newButton.className = 'digit';
    } else if (newButton.innerText == '=') {
      newButton.className = 'sum';
    } else if (newButton.innerText.toLowerCase() == 'c') {
      newButton.className = 'c';
    } else {
      newButton.disabled = true;
    }
    buttonGrid.appendChild(newButton);
  });
}

function addEventListenersToButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (button.className == 'operator') {
      button.addEventListener('click', () => onClickOperator(button.innerText));
    } else if (button.className == 'digit') {
      button.addEventListener('click', () => onClickDigit(button.innerText));
    } else if (button.className == 'sum') {
      button.addEventListener('click', () => calculate());
    } else if (button.className == 'c') {
      button.addEventListener('click', () => onClickC());
    } else if (button.className == 'clear-history-button') {
      button.addEventListener('click', () => onClickClearHistory());
    }
  });
}

function addKeyListenersToButtons() {
  document.addEventListener('keydown', (event) => {
    let key = event.key;
    if (key.startsWith('F') && key.length === 2 && !isNaN(key[1])) {
      event.preventDefault();
      return;
    }
    if (['+', '-', '*', '/'].includes(key) && num1Filled) {
      onClickOperator(key);
    } else if (/\d/.test(key)) {
      onClickDigit(key);
    } else if (key === 'Enter' || key === '=') {
      calculate();
    } else if (key === 'Escape') {
      onClickC();
    }
  });
}

function onClickOperator(operator) {
  operatorDisplay.innerText = operator;
  if (operator == 'X^2' || operator == '√') {
    showDigits = false;
  } else {
    showDigits = true;
  }
  calculate();
  toggleDisable();
  storeLocally();
}

function onClickDigit(digit) {
  if (num1Filled == false) {
    num1Display.innerText = digit;
  } else {
    num2Display.innerText = digit;
  }
  showDigits = false;
  calculate();
  toggleDisable();
  num1Filled = true;
  storeLocally();
}

function calculate() {
  let num1 = parseInt(num1Display.innerText);
  let num2 = parseInt(num2Display.innerText);
  let operator = operatorDisplay.innerText;
  let result;

  if (num1Filled) {
    if (operator == '+') {
      result = add(num1, num2);
    } else if (operator == '-') {
      result = subtract(num1, num2);
    } else if (operator == '*') {
      result = multiply(num1, num2);
    } else if (operator == '/') {
      result = divide(num1, num2);
    } else if (operator == 'X^2') {
      if (!isNaN(parseInt(result))) {
        result = square(result);
      } else {
        result = square(num1);
      }
    } else if (operator == '√') {
      if (!isNaN(parseInt(result))) {
        result = squareRoot(result);
      } else {
        result = squareRoot(num1);
      }
    }

    if (!isNaN(result)) {
      if (isNaN(num2)) {
        num2 = '';
      }
      saveToHistory(num1, operator, num2, result);
      resultDisplay.innerText = result;
      num1Display.innerText = result;
      operatorDisplay.innerText = '';
      num2Display.innerText = '';
      storeLocally();
    }
  }
}

function onClickC() {
  num1Display.innerText = '';
  operatorDisplay.innerText = '';
  num2Display.innerText = '';
  resultDisplay.innerText = '';
  num1Filled = false;
  showDigits = true;
  toggleDisable();
  storeLocally();
}

function onClickClearHistory() {
  historyList.innerHTML = '';
  storeLocally();
}

function toggleDisable() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (button.className == 'operator') {
      if (showDigits) {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    } else if (button.className == 'digit') {
      if (showDigits) {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    }
  });
}

function saveToHistory(num1, operator, num2, result) {
  const newLi = document.createElement('li');
  const newButton = document.createElement('button');
  newButton.innerText = '↶';
  newButton.addEventListener('click', () => {
    num1Display.innerText = result;
    operatorDisplay.innerText = '';
    num2Display.innerText = '';
    resultDisplay.innerText = result;
    showDigits = false;
    toggleDisable();
  });

  const inputHistory = document.createElement('p');
  const resultHistory = document.createElement('p');
  inputHistory.className = 'input-history';
  resultHistory.className = 'result-history';
  inputHistory.innerText = `${num1} ${operator} ${num2} = `;
  resultHistory.innerText = result;

  newLi.appendChild(inputHistory);
  newLi.appendChild(resultHistory);
  newLi.insertBefore(newButton, newLi.firstChild);
  historyList.insertBefore(newLi, historyList.firstChild);
}

function storeLocally() {
  localStorage.setItem('storedNum1', num1Display.innerText);
  localStorage.setItem('storedOp', operatorDisplay.innerText);
  localStorage.setItem('storedNum2', num2Display.innerText);
  localStorage.setItem('storedResult', resultDisplay.innerText);
  localStorage.setItem('storedNum1Filled', num1Filled);
  localStorage.setItem('storedShowDigits', showDigits);
  localStorage.setItem('storedHistoryList', historyList.innerHTML);
}

function getLocalStorage() {
  const loadednum1 = localStorage.getItem('storedNum1');
  const loadedOp = localStorage.getItem('storedOp');
  const loadednum2 = localStorage.getItem('storedNum2');
  const loadedResult = localStorage.getItem('storedResult');
  const loadedNum1Filled = localStorage.getItem('storedNum1Filled');
  const loadedShowDigits = localStorage.getItem('storedShowDigits');
  const loadedHistoryList = localStorage.getItem('storedHistoryList');

  if (loadednum1 !== null) num1Display.innerText = loadednum1;
  if (loadedOp !== null) operatorDisplay.innerText = loadedOp;
  if (loadednum2 !== null) num2Display.innerText = loadednum2;
  if (loadedResult !== null) resultDisplay.innerText = loadedResult;
  if (loadedNum1Filled !== null) num1Filled = loadedNum1Filled === 'true';
  if (loadedShowDigits !== null) showDigits = loadedShowDigits === 'true';

  if (loadedHistoryList !== null) {
    historyList.innerHTML = loadedHistoryList;

    //Lägg till click-listeners igen (följer inte med från local storage)
    historyList.querySelectorAll('li button').forEach((button) => {
      button.addEventListener('click', () => {
        const listItem = button.parentElement;
        const result = listItem.querySelector('.result-history').innerText;
        num1Display.innerText = result;
        operatorDisplay.innerText = '';
        num2Display.innerText = '';
        resultDisplay.innerText = result;
        showDigits = false;
        toggleDisable();
      });
    });
  }
}

createButtons();
addEventListenersToButtons();
addKeyListenersToButtons();
getLocalStorage();
toggleDisable();
