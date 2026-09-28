//app\calcPage\coverPanelPage\cabinetManager\utils\cabinetReorder.js
import { SCALE, START_OFFSET } from '../config/cabinetConfig.js';
import { getCabinetType } from './cabinetHelpers.js';

export function reorderHeadersAndRender(container, headers, draggedBoxes, reRenderFn) {
  console.log(`[DEBUG REORDER] Startar ordning och kontroll av tillåtna luckor.`);
  
  // Hämta ALLA wrappers eftersom de nu ligger på separata rader
  const wrappers = Array.from(container.querySelectorAll('.cover-panel-grid'));
  if (wrappers.length === 0) {
    reRenderFn();
    return;
  }

  const boxData = new Map();
  
  wrappers.forEach((wrapper, wrapperIdx) => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const boxes = Array.from(wrapper.querySelectorAll('.cabinet-box'));
    
    boxes.forEach(b => {
      const rect = b.getBoundingClientRect();
      const currentLeft = rect.left - wrapperRect.left;
      const idx = parseInt(b.dataset.index, 10);
      if (!isNaN(idx)) {
        boxData.set(idx, {
          wrapperIdx, // Håll koll på vilken rad (container) stommen befinner sig i
          x: currentLeft,
          width: b.offsetWidth,
          type: getCabinetType(b),
          group: b.dataset.group || null
        });
      }
    });
  });

  headers.forEach(h => {
    delete h._offsetX;
  });

  const indices = headers.map((_, i) => i);
  
  indices.sort((a, b) => {
    const dataA = boxData.get(a);
    const dataB = boxData.get(b);
    
    if (!dataA && !dataB) return a - b;
    if (!dataA) return 1;
    if (!dataB) return -1;
    
    // Sortera först på vilken rad de tillhör (förhindrar omkastning mellan containrar)
    if (dataA.wrapperIdx !== dataB.wrapperIdx) {
      return dataA.wrapperIdx - dataB.wrapperIdx;
    }

    // Sortera därefter på X-koordinaten
    const diff = dataA.x - dataB.x;
    if (Math.abs(diff) > 0.5) {
      return diff;
    }
    return a - b;
  });

  const sortedHeaders = indices.map(i => headers[i]);
  for (let i = 0; i < headers.length; i++) {
    headers[i] = sortedHeaders[i];
  }

  const groupedIndices = new Map();
  const ungroupedIndices = [];

  sortedHeaders.forEach((header, newArrayIdx) => {
    const originalIndex = indices[newArrayIdx]; 
    const group = header.group !== undefined && header.group !== null && String(header.group).trim() !== ''
      ? String(header.group).trim()
      : null;
    
    if (group !== null) {
      if (!groupedIndices.has(group)) groupedIndices.set(group, []);
      groupedIndices.get(group).push(originalIndex);
    } else {
      ungroupedIndices.push(originalIndex);
    }
  });

  const sections = [];
  const sortedGroupKeys = Array.from(groupedIndices.keys()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  sortedGroupKeys.forEach(grpKey => sections.push(groupedIndices.get(grpKey)));
  if (ungroupedIndices.length > 0) sections.push(ungroupedIndices);

  sections.forEach((sectionIndices) => {
    if (sectionIndices.length === 0) return;
    
    let minX = Infinity;
    sectionIndices.forEach(idx => {
      if (boxData.has(idx)) {
        minX = Math.min(minX, boxData.get(idx).x);
      }
    });

    minX = Math.max(START_OFFSET, minX);

    let baseTrackX = minX;
    let wallTrackX = minX;

    sectionIndices.forEach(idx => {
      if (!boxData.has(idx)) return;
      const data = boxData.get(idx);
      
      let expectedX = 0;
      if (data.type === 'tall') {
        expectedX = Math.max(baseTrackX, wallTrackX);
      } else if (data.type === 'base') {
        expectedX = baseTrackX;
      } else if (data.type === 'wall') {
        expectedX = wallTrackX;
      }
      const gap = Math.round(data.x - expectedX);
      if (gap > (2 * SCALE) && data.type === 'wall') {
        const targetHeaderIndex = indices.indexOf(idx);
        if (targetHeaderIndex !== -1) {
          sortedHeaders[targetHeaderIndex]._offsetX = gap;
        }
        expectedX = data.x; 
      }
      if (data.type === 'tall') {
        baseTrackX = expectedX + data.width;
        wallTrackX = expectedX + data.width;
      } else if (data.type === 'base') {
        baseTrackX = expectedX + data.width;
      } else if (data.type === 'wall') {
        wallTrackX = expectedX + data.width;
      }
    });
  });

  reRenderFn();
}