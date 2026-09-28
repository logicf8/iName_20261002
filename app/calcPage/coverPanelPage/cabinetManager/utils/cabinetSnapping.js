//app\calcPage\coverPanelPage\cabinetManager\utils\cabinetSnapping.js
import { SNAP_THRESHOLD, START_OFFSET } from '../config/cabinetConfig.js';
import { updateSharedPlinths } from '../ui/cabinetRenderer.js';
import { getCabinetType } from './cabinetHelpers.js';
import { reorderHeadersAndRender } from './cabinetReorder.js';

export function applySnappingAndReorder(container, headers, draggedBoxes, totalDeltaX, reRenderFn) {
  const wrapper = container.querySelector('.cover-panel-grid');
  if (!wrapper) {
    console.log(`[DEBUG SNAP ERROR] Hittade inte .cover-panel-grid wrapper!`);
    return;
  }

  const allBoxes = Array.from(wrapper.querySelectorAll('.cabinet-box'));
  const snapThreshold = SNAP_THRESHOLD;
  const wrapperRect = wrapper.getBoundingClientRect();

  console.log(`--------------------------------------------------`);
  console.log(`[DEBUG SNAP START] Startar snäppning. totalDeltaX = ${totalDeltaX}, tröskel = ${snapThreshold}`);

  let initialMinLeft = Infinity;
  let initialMaxRight = -Infinity;

  draggedBoxes.forEach(b => {
    const rect = b.getBoundingClientRect();
    const currentPos = rect.left - wrapperRect.left;
    const baseLeft = currentPos - totalDeltaX;
    const bRight = baseLeft + b.offsetWidth;
    if (baseLeft < initialMinLeft) initialMinLeft = baseLeft;
    if (bRight > initialMaxRight) initialMaxRight = bRight;
  });

  const currentMinLeft = initialMinLeft + totalDeltaX;
  const currentMaxRight = initialMaxRight + totalDeltaX;

  const staticBoxes = allBoxes.filter(b => !draggedBoxes.includes(b));
  const baseEdges = [];
  const wallEdges = [];
  const tallEdges = [];

  staticBoxes.forEach(b => {
    const rect = b.getBoundingClientRect();
    const left = rect.left - wrapperRect.left;
    const right = rect.right - wrapperRect.left;
    const type = getCabinetType(b);
    if (type === 'wall') wallEdges.push(left, right);
    else if (type === 'tall') tallEdges.push(left, right);
    else baseEdges.push(left, right);
  });

  let validSnapEdges = [...baseEdges, ...wallEdges, ...tallEdges, START_OFFSET];
  function hasCollision(testDelta) {
    for (let dragged of draggedBoxes) {
      const rect = dragged.getBoundingClientRect();
      const currentPos = rect.left - wrapperRect.left;
      const initialBaseLeft = currentPos - totalDeltaX;
      const width = dragged.offsetWidth;
      const tLeft = initialBaseLeft + testDelta;
      const tRight = tLeft + width;

      if (tLeft < START_OFFSET - 0.5) {
        return true;
      }

      const currentType = getCabinetType(dragged);
      for (let b of staticBoxes) {
        const bRect = b.getBoundingClientRect();
        const bLeft = bRect.left - wrapperRect.left;
        const bRight = bRect.right - wrapperRect.left;
        const bType = getCabinetType(b);
        if ((currentType === 'base' && bType === 'wall') || (currentType === 'wall' && bType === 'base')) {
          continue;
        }
        const overlaps = (tLeft < bRight - 0.5) && (tRight > bLeft + 0.5);
        if (overlaps) {
          return true;
        }
      }
    }
    return false;
  }

  let bestSnapDelta = totalDeltaX;
  let minDistance = snapThreshold + 1;

  validSnapEdges.forEach(edge => {
    const distLeft = Math.abs(currentMinLeft - edge);
    if (distLeft < snapThreshold) {
      const targetDeltaLeft = edge - initialMinLeft;
      const collides = hasCollision(targetDeltaLeft);
      if (!collides && distLeft < minDistance) {
        minDistance = distLeft;
        bestSnapDelta = targetDeltaLeft;
      }
    }
    const distRight = Math.abs(currentMaxRight - edge);
    if (distRight < snapThreshold) {
      const targetDeltaRight = edge - initialMaxRight;
      const collides = hasCollision(targetDeltaRight);
      if (!collides && distRight < minDistance) {
        minDistance = distRight;
        bestSnapDelta = targetDeltaRight;
      }
    }
  });

  if (minDistance > snapThreshold) {
    bestSnapDelta = totalDeltaX;
  }

  if ((initialMinLeft + bestSnapDelta) < START_OFFSET) {
    bestSnapDelta = START_OFFSET - initialMinLeft;
  }

  if (Math.abs(bestSnapDelta) < 0.5) {
    console.log(`[DEBUG SNAP] Ingen förflyttning (bestSnapDelta ≈ 0). Bevarar befintlig ordning och offsets.`);
    draggedBoxes.forEach(b => {
      b.style.transform = '';
    });
    updateSharedPlinths(wrapper);
    reRenderFn();
    return;
  }

  draggedBoxes.forEach(b => {
    b.style.transform = `translateX(${bestSnapDelta}px)`;
  });
  
  updateSharedPlinths(wrapper);
  reorderHeadersAndRender(container, headers, draggedBoxes, reRenderFn);
}