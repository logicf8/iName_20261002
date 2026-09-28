//app\calcPage\coverPanelPage\cabinetManager\events\cabinetSelection.js
import { clearSelection, setBoxSelected } from '../state/cabinetState.js';
import { updateSharedPlinths } from '../ui/cabinetRenderer.js';
import { applySnappingAndReorder } from '../utils/cabinetSnapping.js';

export function initSelection(container, headers, reRenderFn) {
  let isDraggingLasso = false;
  let startX, startY;

  let isDraggingBoxes = false;
  let draggedBoxes = [];
  let boxDragStartX = 0;

  let selectionBox = document.querySelector('.selection-box');
  if (!selectionBox) {
    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    selectionBox.style.position = 'absolute';
    selectionBox.style.border = '1px dashed #007bff';
    selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
    selectionBox.style.pointerEvents = 'none';
    selectionBox.style.display = 'none';
    selectionBox.style.zIndex = '1000';
    document.body.appendChild(selectionBox);
  }

  container.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('.remove-dummy-btn')) return;

    const box = e.target.closest('.cabinet-box');

    if (box) {
      isDraggingBoxes = true;
      boxDragStartX = e.pageX;
      console.log(`[DEBUG MOUSE] Mousedown på box ID: ${box.dataset.id}, index: ${box.dataset.index}, startX: ${boxDragStartX}`);

      if (!box.classList.contains('selected')) {
        if (!e.shiftKey && !e.ctrlKey) {
          clearSelection(container);
        }
        setBoxSelected(box, true);
      }

      draggedBoxes = Array.from(container.querySelectorAll('.cabinet-box.selected'));
      console.log(`[DEBUG MOUSE] Antal dragna boxar: ${draggedBoxes.length}`);

      draggedBoxes.forEach(b => {
        b.style.cursor = 'grabbing';
      });
      return;
    }

    isDraggingLasso = true;
    startX = e.pageX;
    startY = e.pageY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDraggingBoxes) {
      const deltaX = e.pageX - boxDragStartX;

      draggedBoxes.forEach(b => {
        b.style.transform = `translateX(${deltaX}px)`;
        b.style.zIndex = '1000';
      });
      
      const wrapper = container.querySelector('.cover-panel-grid');
      if (wrapper) updateSharedPlinths(wrapper);
      
      return;
    }

    if (isDraggingLasso) {
      const currentX = e.pageX;
      const currentY = e.pageY;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      selectionBox.style.left = `${left}px`;
      selectionBox.style.top = `${top}px`;
      selectionBox.style.width = `${width}px`;
      selectionBox.style.height = `${height}px`;

      const boxes = container.querySelectorAll('.cabinet-box');
      const selRect = selectionBox.getBoundingClientRect();

      boxes.forEach(box => {
        const bRect = box.getBoundingClientRect();
        const overlap = !(selRect.right < bRect.left || 
                          selRect.left > bRect.right || 
                          selRect.bottom < bRect.top || 
                          selRect.top > bRect.bottom);

        setBoxSelected(box, overlap);
      });
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (isDraggingBoxes) {
      isDraggingBoxes = false;
      draggedBoxes.forEach(b => b.style.cursor = 'grab');

      const totalDeltaX = e.pageX - boxDragStartX;
      console.log(`[DEBUG MOUSEUP] Släpper boxar. totalDeltaX: ${totalDeltaX}`);
      applySnappingAndReorder(container, headers, draggedBoxes, totalDeltaX, reRenderFn);
    }

    if (isDraggingLasso) {
      isDraggingLasso = false;
      selectionBox.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const selected = container.querySelectorAll('.cabinet-box.selected');
      if (selected.length === 0) return;

      const groupNum = prompt('Ange gruppnummer för markerade stommar:');
      if (groupNum !== null) {
        selected.forEach(box => {
          const input = box.querySelector('.group-num-input');
          if (input) {
            input.value = groupNum;
            input.dispatchEvent(new Event('change'));
          }
        });
      }
    }
  });
}