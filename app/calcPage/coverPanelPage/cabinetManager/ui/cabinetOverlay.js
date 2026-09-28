//app\calcPage\coverPanelPage\cabinetManager\ui\cabinetOverlay.js
export function updateCeilingLine(container, ceilingHeightPx) {
  const wrapper = container.querySelector('.cover-panel-grid');
  if (!wrapper) return;

  let line = wrapper.querySelector('.ceiling-line');

  if (ceilingHeightPx === null || isNaN(ceilingHeightPx)) {
    if (line) line.remove();
    return;
  }

  if (!line) {
    line = document.createElement('div');
    line.className = 'ceiling-line';
    line.style.position = 'absolute';
    line.style.left = '0';
    line.style.right = '0';
    line.style.borderTop = '2px dashed #ff0000';
    line.style.pointerEvents = 'none';
    line.style.zIndex = '150';

    const label = document.createElement('span');
    label.className = 'ceiling-label';
    label.style.position = 'absolute';
    label.style.right = '5px';
    label.style.top = '-18px';
    label.style.fontSize = '11px';
    label.style.color = '#ff0000';
    label.style.fontWeight = 'bold';
    line.appendChild(label);

    wrapper.appendChild(line);
  }

  line.style.bottom = `${ceilingHeightPx}px`;
  const labelSpan = line.querySelector('.ceiling-label');
  if (labelSpan) {
    labelSpan.textContent = `Tak: ${ceilingHeightPx} px`;
  }
}