//app\calcPage\coverPanelPage\cabinetManager\ui\cabinetControls.js
import { SCALE } from '../config/cabinetConfig.js';

export function createControls(container, toggleInputsCallback, logGroupsCallback, onCeilingChangeCallback, onAddDummyCallback) {
  const btnWrapper = document.createElement('div');
  btnWrapper.style.marginTop = '50px';
  btnWrapper.style.display = 'flex';
  btnWrapper.style.alignItems = 'center';
  btnWrapper.style.gap = '10px';

  const finishBtn = document.createElement('button');
  finishBtn.textContent = 'Klar med gruppering';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editera';

  const dummyBtn = document.createElement('button');
  dummyBtn.textContent = 'Dummy';
  dummyBtn.addEventListener('click', () => {
    if (onAddDummyCallback) onAddDummyCallback();
  });

  const ceilingLabel = document.createElement('label');
  ceilingLabel.textContent = 'Takhöjd (cm): ';
  ceilingLabel.style.marginLeft = '20px';

  const ceilingInput = document.createElement('input');
  ceilingInput.type = 'number';
  ceilingInput.placeholder = 't.ex. 240';
  ceilingInput.style.width = '80px';
  ceilingInput.style.padding = '3px';

  ceilingInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (onCeilingChangeCallback) {
      onCeilingChangeCallback(isNaN(val) ? null : val * SCALE);
    }
  });

  btnWrapper.appendChild(finishBtn);
  btnWrapper.appendChild(editBtn);
  btnWrapper.appendChild(dummyBtn);
  btnWrapper.appendChild(ceilingLabel);
  btnWrapper.appendChild(ceilingInput);
  container.appendChild(btnWrapper);

  finishBtn.addEventListener('click', () => {
    toggleInputsCallback(container, false);
    logGroupsCallback(container);
  });

  editBtn.addEventListener('click', () => {
    toggleInputsCallback(container, true);
  });
}