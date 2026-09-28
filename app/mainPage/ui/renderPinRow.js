// app\mainPage\ui\renderPinRow.js

import {
  updatePinAmount
} from '../state/cPinState.js';

export function createPinRow(article) {
  const row = document.createElement('div');

  row.className = 'pin-row';

  row.dataset.artNr = article.artNr;

  const label = document.createElement('span');

  label.className = 'pin-label';

  let text;

  if (article.width && article.height) {
    text =
      article.group3 === 'N/A'
        ? `${article.width} x ${article.height}`
        : `${article.width} x ${article.height} (${article.group3})`;
  } else {
    text = article.name;
  }

  label.textContent = text;

  const amountWrap = document.createElement('div');

  amountWrap.className = 'amount-wrap';

  const minusBtn = document.createElement('button');

  minusBtn.type = 'button';
  minusBtn.textContent = '−';
  minusBtn.tabIndex = -1;

  const plusBtn = document.createElement('button');

  plusBtn.type = 'button';
  plusBtn.textContent = '+';
  plusBtn.tabIndex = -1;

  const input = document.createElement('input');

  input.type = 'number';
  input.min = 0;
  input.max = 99;
  input.value = 0;

  function setValue(val) {
    val = Math.max(0, Math.min(99, val));

    input.value = val;

    updatePinAmount(article.artNr, val);
  }

  minusBtn.addEventListener('click', () => {
    setValue(Number(input.value) - 1);
  });

  plusBtn.addEventListener('click', () => {
    setValue(Number(input.value) + 1);
  });

  input.addEventListener('input', () => {
    setValue(Number(input.value));
  });

  amountWrap.appendChild(minusBtn);
  amountWrap.appendChild(input);
  amountWrap.appendChild(plusBtn);

  row.appendChild(label);
  row.appendChild(amountWrap);

  return row;
}