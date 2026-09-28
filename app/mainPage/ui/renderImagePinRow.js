// app\mainPage\ui\renderImagePinRow.js

import {
  updatePinAmount
} from '../state/cPinState.js';

export function createImagePinRow(article) {
  const wrapper = document.createElement('div');

  wrapper.className = 'pin-image-item';

  wrapper.dataset.artNr = article.artNr;

  const title = document.createElement('div');

  title.className = 'pin-image-title';

  title.textContent = article.name;

  const row = document.createElement('div');

  row.className = 'pin-image-row';

  const img = document.createElement('img');

  img.src = `./app/mainPage/pics/articlar/${article.pic}`;

  img.alt = article.name;

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
  input.tabIndex = 0;

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

  row.appendChild(img);
  row.appendChild(amountWrap);

  wrapper.appendChild(title);
  wrapper.appendChild(row);

  return wrapper;
}