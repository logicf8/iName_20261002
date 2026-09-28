//app\calcPage\coverPanelPage\cabinetManager\ui\cabinetRenderer.js
import { filter } from '../../../../../core/shared/global/myConstants.js';
import { SCALE, GROUP_GAP, START_OFFSET } from '../config/cabinetConfig.js';
import { optimizeUngroupedItems } from '../utils/cabinetUtils.js';
import { calculateCabinetBottomPx } from '../utils/cabinetLayout.js';
import { createCabinetBox } from './cabinetBoxBuilder.js';
import { updateSharedPlinths } from './cabinetPlinths.js';
import { updateCeilingLine } from './cabinetOverlay.js';
import { createControls } from './cabinetControls.js';

export { updateSharedPlinths, updateCeilingLine, createControls };

export function renderCabinets(container, headers, reRenderFn) {
  container.innerHTML = '';

  const groupedHeaders = new Map();
  const ungrouped = [];

  // Separera stommar baserat på deras grupp
  headers.forEach((header, index) => {
    const item = { header, originalIndex: index, width: header.width || 60 };
    const group = header.group !== undefined && header.group !== null && String(header.group).trim() !== ''
      ? String(header.group).trim()
      : null;

    if (group !== null) {
      if (!groupedHeaders.has(group)) {
        groupedHeaders.set(group, []);
      }
      groupedHeaders.get(group).push(item);
    } else {
      ungrouped.push(item);
    }
  });

  const sections = [];
  const sortedGroupKeys = Array.from(groupedHeaders.keys()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  sortedGroupKeys.forEach(grpKey => {
    sections.push({
      groupId: grpKey,
      items: groupedHeaders.get(grpKey)
    });
  });

  if (ungrouped.length > 0) {
    sections.push({
      groupId: null,
      items: optimizeUngroupedItems(ungrouped)
    });
  }

  // Skapa en ny wrapper (rad) för varje sektion/grupp
  sections.forEach((section) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cover-panel-grid';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = `${270 * SCALE}px`;
    wrapper.style.borderBottom = '2px solid #000';
    wrapper.style.marginBottom = '40px'; // Ger ett tydligt avstånd mellan de olika grupperna/containrarna
    wrapper.dataset.group = section.groupId || 'ungrouped';

    // Börja alltid från startpunkten på varje ny rad
    let currentX = START_OFFSET;
    let baseTrackX = currentX;
    let wallTrackX = currentX;

    section.items.forEach((itemObj) => {
      const { header, originalIndex, width } = itemObj;
      const type = header.type;
      const itemWidthPx = width * SCALE;
      const rawHeightPx = (header.height || 80) * SCALE;

      const isHigh = type === filter.Cabinet.group2.High;
      const isTop = type === filter.Cabinet.group2.Top;
      const isBase = type === filter.Cabinet.group2.Base;
      const isWall = type === filter.Cabinet.group2.Wall;

      let itemX = currentX;
      
      if (isHigh) {
        itemX = Math.max(baseTrackX, wallTrackX);
      } else if (isBase) {
        itemX = baseTrackX;
      } else if (isWall || isTop) {
        itemX = wallTrackX;
      }

      const isDummy = !!header.isDummy;
      const cabinetBottomPx = isDummy ? 0 : calculateCabinetBottomPx(header, type, rawHeightPx);

      if (header._offsetX !== undefined) {
        itemX += header._offsetX;
      }
      const nextX = itemX + itemWidthPx;

      if (isHigh) {
        baseTrackX = nextX;
        wallTrackX = nextX;
        currentX = nextX;
      } else if (isBase) {
        baseTrackX = nextX;
        currentX = Math.max(currentX, baseTrackX);
      } else if (isWall || isTop) {
        wallTrackX = nextX;
        currentX = Math.max(currentX, wallTrackX);
      }

      const box = createCabinetBox({
        header,
        originalIndex,
        itemX,
        cabinetBottomPx,
        itemWidthPx,
        rawHeightPx,
        type,
        container,
        headers,
        renderCabinetsFn: reRenderFn || (() => renderCabinets(container, headers, reRenderFn))
      });

      wrapper.appendChild(box);
    });

    wrapper._headersData = headers;
    container.appendChild(wrapper);
    updateSharedPlinths(wrapper);
  });
}