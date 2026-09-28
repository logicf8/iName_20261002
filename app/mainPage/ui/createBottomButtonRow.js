// app\mainPage\ui\createBottomButtonRow.js

import {
  exportSelectedArticles
} from '../services/exportSelectedArticles.js';

import {
  cPinAmounts
} from '../state/cPinState.js';

function createExportBtn() {
  const wrapper = document.createElement('div');

  wrapper.style.width = '100%';

  wrapper.style.display = 'flex';

  wrapper.style.justifyContent = 'center';

  const btn = document.createElement('button');

  btn.textContent = 'Hämta import fil';

  btn.addEventListener(
    'click',
    exportSelectedArticles
  );

  wrapper.appendChild(btn);

  return wrapper;
}

function resetAllPinInputs() {
  document
    .querySelectorAll(
      '.pin-row input[type="number"], .pin-image-item input[type="number"]'
    )
    .forEach(input => {
      input.value = 0;
    });

  Object.keys(cPinAmounts).forEach(key => {
    cPinAmounts[key] = 0;
  });
}

function createResetBtn() {
  const btn = document.createElement('button');

  btn.textContent = 'Nollställ';

  btn.addEventListener('click', () => {
    if (
      !confirm(
        'Vill du nollställa alla valda artiklar?'
      )
    ) {
      return;
    }

    resetAllPinInputs();
  });

  return btn;
}

export function createBottomButtonRow() {
  const row = document.createElement('div');

  row.className = 'pin-button-row';

  const resetWrap = document.createElement('div');

  resetWrap.className = 'pin-btn-reset';

  resetWrap.appendChild(createResetBtn());

  const exportWrap = document.createElement('div');

  exportWrap.className = 'pin-btn-export';

  exportWrap.appendChild(createExportBtn());

  row.appendChild(resetWrap);
  row.appendChild(exportWrap);

  return row;
}