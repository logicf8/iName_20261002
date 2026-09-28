import { filter } from '../../../../../core/shared/global/myConstants.js';
import { BASE_RECT_HEIGHT } from '../config/cabinetConfig.js';

export function updateSharedPlinths(wrapper) {
  if (!wrapper) return;
  const wrapperRect = wrapper.getBoundingClientRect();
  
  // Hämta bänkskåp och högskåp, men exkludera dummies så att de inte täcks av sockeln
  const cabinets = Array.from(wrapper.querySelectorAll('.cabinet-box')).filter(b => {
    const isDummy = b.dataset.isDummy === 'true' || b.classList.contains('dummy-box');
    if (isDummy) return false;

    const type = b.dataset.type;
    return type === 'base' || type === filter.Cabinet.group2.Base || type === 'tall' || type === filter.Cabinet.group2.High || b.classList.contains('tall-cabinet');
  });

  const posData = cabinets.map(b => {
    const rect = b.getBoundingClientRect();
    return {
      left: rect.left - wrapperRect.left,
      right: rect.right - wrapperRect.left,
      selected: b.classList.contains('selected')
    };
  });

  posData.sort((a, b) => a.left - b.left);

  const plinthsData = [];
  let currentPlinth = null;

  posData.forEach(data => {
    if (!currentPlinth) {
      currentPlinth = { left: data.left, right: data.right, selected: data.selected };
      plinthsData.push(currentPlinth);
    } else {
      const gap = data.left - currentPlinth.right;
      if (gap <= 2) { 
        currentPlinth.right = Math.max(currentPlinth.right, data.right);
        if (data.selected) currentPlinth.selected = true; 
      } else {
        currentPlinth = { left: data.left, right: data.right, selected: data.selected };
        plinthsData.push(currentPlinth);
      }
    }
  });

  let plinthContainer = wrapper.querySelector('.plinth-container');
  if (!plinthContainer) {
    plinthContainer = document.createElement('div');
    plinthContainer.className = 'plinth-container';
    
    plinthContainer.style.setProperty('position', 'absolute', 'important');
    plinthContainer.style.setProperty('left', '0', 'important');
    plinthContainer.style.setProperty('bottom', '0', 'important');
    plinthContainer.style.setProperty('width', '100%', 'important');
    plinthContainer.style.setProperty('height', `${BASE_RECT_HEIGHT}px`, 'important');
    plinthContainer.style.setProperty('pointer-events', 'none', 'important');
    plinthContainer.style.setProperty('z-index', '99', 'important');
    plinthContainer.style.setProperty('display', 'block', 'important');
    plinthContainer.style.setProperty('visibility', 'visible', 'important');
    plinthContainer.style.setProperty('opacity', '1', 'important');
    
    wrapper.appendChild(plinthContainer);
  }

  plinthContainer.innerHTML = '';

  plinthsData.forEach(p => {
    const pEl = document.createElement('div');
    pEl.className = 'cabinet-base-rect';
    
    pEl.style.setProperty('position', 'absolute', 'important');
    pEl.style.setProperty('left', `${p.left}px`, 'important');
    pEl.style.setProperty('bottom', '0px', 'important');
    pEl.style.setProperty('width', `${p.right - p.left}px`, 'important');
    pEl.style.setProperty('height', `${BASE_RECT_HEIGHT}px`, 'important');
    pEl.style.setProperty('display', 'block', 'important');
    pEl.style.setProperty('visibility', 'visible', 'important');
    
    const bgColor = '#ffffff';
    pEl.style.setProperty('background-color', bgColor, 'important');
    pEl.style.setProperty('border', `1.2px solid #000000`, 'important');
    pEl.style.setProperty('box-sizing', 'border-box', 'important');
    
    plinthContainer.appendChild(pEl);
  });
}