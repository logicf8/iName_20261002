//app\calcPage\coverPanelPage\state\cabinetState.js
import { updateSharedPlinths } from '../ui/cabinetRenderer.js';

//app\calcPage\coverPanelPage\state\cabinetState.js
export function clearSelection(container) {
  container.querySelectorAll('.cabinet-box.selected').forEach(box => {
    setBoxSelected(box, false);
  });
}

export function setBoxSelected(box, isSelected) {
  box.classList.toggle('selected', isSelected);

  if (isSelected) {
    box.style.borderColor = '#007bff';
    box.style.backgroundColor = '#e6f0ff';
  } else {
    box.style.borderColor = '#000000';
    box.style.backgroundColor = '#ffffff';
  }
  
  // Uppdatera de delade socklarna dynamiskt så fort något markeras
  const wrapper = box.closest('.cover-panel-grid');
  if (wrapper) {
    updateSharedPlinths(wrapper);
  }
}

export function toggleInputs(container, enabled) {
  const inputs = container.querySelectorAll('.group-num-input');
  inputs.forEach(input => input.disabled = !enabled);
}