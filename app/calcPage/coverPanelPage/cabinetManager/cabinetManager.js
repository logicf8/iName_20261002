import { filter } from '../../../../core/shared/global/myConstants.js';
import { currentSectionPortfolio } from '../../../../main.js';
import { renderCabinets, createControls, updateCeilingLine } from './ui/cabinetRenderer.js';
import { initSelection } from './events/cabinetSelection.js';
import { toggleInputs } from './state/cabinetState.js';
import { logGroups } from './utils/cabinetUtils.js';
import { handleAddDummy } from './dummyManager.js';

export function initCoverPanel() {
  const container = document.getElementById('coverPanelContainer');
  if (!container) return;

  const headers = currentSectionPortfolio?.returnHeaders() || [];

  const validHeaders = [];
  
  headers.forEach(header => {
    if (!header || !header.constructor) return;

    const constructorName = header.constructor.name;

    if (constructorName === "CombinationHeader") {
      validHeaders.push(header);
    } 
    else if (constructorName === "CombinationFreeStanding") {
      const applianceType = header.group2;

      const isDishW = applianceType === filter.Appliance.group2.Dishwasher;
      const isWasherD = applianceType === filter.Appliance.group2.WasherDryer;
      const ffGroup3 = header.group3;
      const ffHeight = header.height;
      const isFridgeF = (applianceType === filter.Appliance.group2.Fridge && ffGroup3 === filter.Appliance.group3.FreeStanding && ffHeight === "80");
        
      if (isDishW || isWasherD || isFridgeF) {
        const proxyHeader = new Proxy(header, {
          get(target, prop) {
            if (prop === 'rawType') return target.type || target.group2;
            if (prop === 'type') return filter.Cabinet.group2.Base;
            if (prop === 'width') return target.width || 60;
            if (prop === 'height') return target.height || 80;
            return target[prop];
          }
        });
        validHeaders.push(proxyHeader);
      }
    } 
    else if (constructorName === "OpenHeader") {
      const type = header.type;
      if (type === filter.Cabinet.group2.Base || type === filter.Cabinet.group2.Wall) {
        validHeaders.push(header);
      }
    }
    else if (constructorName === "CoverPanelHeader" && header.owner === "Nedre hörn") {
      const proxyHeader = new Proxy(header, {
        get(target, prop) {
          if (prop === 'isCornerBase') return true; // Flagga för BoxBuilder
          if (prop === 'rawType') return target.type || target.owner;
          if (prop === 'type') return filter.Cabinet.group2.Base;
          if (prop === 'width') return 67.5;
          if (prop === 'height') return target.height || 80;
          return target[prop];
        }
      });
      validHeaders.push(proxyHeader);
    }
    else if (header.isDummy) {
      validHeaders.push(header);
    }
  });

  container.innerHTML = '';
  const cabinetContainer = document.createElement('div');
  cabinetContainer.className = 'cabinets-wrapper';
  container.appendChild(cabinetContainer);
  let currentCeilingPx = null;

  const reRender = () => {
    renderCabinets(cabinetContainer, validHeaders, reRender);
    if (currentCeilingPx !== null) {
      updateCeilingLine(cabinetContainer, currentCeilingPx);
    }
    logGroups(cabinetContainer);
  };
  
  reRender();
  initSelection(cabinetContainer, validHeaders, reRender);
  
  createControls(
    container, 
    toggleInputs, 
    logGroups, 
    (ceilingPx) => {
      currentCeilingPx = ceilingPx;
      updateHeaderOffsetsAndRenderLine(currentCeilingPx);
    },
    () => handleAddDummy(validHeaders, reRender)
  );

  function updateHeaderOffsetsAndRenderLine(ceilingPx) {
    currentCeilingPx = ceilingPx;
    updateCeilingLine(cabinetContainer, ceilingPx);
  }
}