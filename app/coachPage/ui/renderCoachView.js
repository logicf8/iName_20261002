import { 
  nkpText, 
  wtText, wtContainer, 
  wpText, wpContainer,
  hrText, hrContainer,
  ovrigtText, ovrigtContainer,
  tipsText, tipsContainer,
  finalText,
  finalSelect // <-- Se till att importera finalSelect från selectors.js
} from '../config/selectors.js';

import { FINAL_OPTIONS } from '../config/finalOptions.js'; // <-- Importera alternativ-arrayen
import { createQuillEditor } from '../../pageControl/utils/quillSetup.js';

let nkpEditorInstance = null;
let wtEditorInstance = null;
let wpEditorInstance = null;
let hrEditorInstance = null;
let ovrigtEditorInstance = null;
let tipsEditorInstance = null;
let finalEditorInstance = null;

export function initCoachPage() {
  populateFinalSelect();
}

function populateFinalSelect() {
  const selectEl = finalSelect || document.getElementById('finalSelect');
  if (!selectEl) return;

  // Töm befintliga options om det skulle finnas några
  selectEl.innerHTML = '';

  // Skapa och lägg till alla option-element
  FINAL_OPTIONS.forEach(text => {
    const option = document.createElement('option');
    option.value = text;
    option.textContent = text;
    selectEl.appendChild(option);
  });
}

export function initCoachEditors() {
  const nkpEl = nkpText || document.getElementById('nkpText');
  const wtEl = wtText || document.getElementById('wtText');
  const wpEl = wpText || document.getElementById('wpText');
  const hrEl = hrText || document.getElementById('hrText');
  const ovrigtEl = ovrigtText || document.getElementById('ovrigtText');
  const tipsEl = tipsText || document.getElementById('tipsText');
  const finalEl = finalText || document.getElementById('finalText');

  if (nkpEl && !nkpEditorInstance) {
    nkpEditorInstance = createQuillEditor(nkpEl);
  }

  if (wtEl && !wtEditorInstance) {
    wtEditorInstance = createQuillEditor(wtEl);
  }

  if (wpEl && !wpEditorInstance) {
    wpEditorInstance = createQuillEditor(wpEl);
  }

  if (hrEl && !hrEditorInstance) {
    hrEditorInstance = createQuillEditor(hrEl);
  }

  if (ovrigtEl && !ovrigtEditorInstance) {
    ovrigtEditorInstance = createQuillEditor(ovrigtEl);
  }

  if (tipsEl && !tipsEditorInstance) {
    tipsEditorInstance = createQuillEditor(tipsEl);
  }

  if (finalEl && !finalEditorInstance) {
    finalEditorInstance = createQuillEditor(finalEl);
  }

  return { 
    nkpEditorInstance, 
    wtEditorInstance, 
    wpEditorInstance, 
    hrEditorInstance,
    ovrigtEditorInstance,
    tipsEditorInstance,
    finalEditorInstance
  };
}

export function updateCoachViewSections(sectionPortfolio) {
  if (!sectionPortfolio) return;

  const wtCont = wtContainer || document.getElementById('wtContainer');
  const wpCont = wpContainer || document.getElementById('wpContainer');
  const hrCont = hrContainer || document.getElementById('hrContainer');

  if (wtCont) {
    const isWtActive = sectionPortfolio?.cmInfoFlag?.wtInfo?.state !== 0;
    wtCont.style.display = isWtActive ? 'flex' : 'none';
  }

  if (wpCont) {
    const isWpActive = sectionPortfolio?.cmInfoFlag?.wpInfo?.state !== 0;
    wpCont.style.display = isWpActive ? 'flex' : 'none';
  }

  if (hrCont) {
    const isHrActive = sectionPortfolio?.cmInfoFlag?.hrInfo?.state !== 0;
    hrCont.style.display = isHrActive ? 'flex' : 'none';
  }
}

export function getNkpEditor() { return nkpEditorInstance; }
export function getWtEditor() { return wtEditorInstance; }
export function getWpEditor() { return wpEditorInstance; }
export function getHrEditor() { return hrEditorInstance; }
export function getOvrigtEditor() { return ovrigtEditorInstance; }
export function getTipsEditor() { return tipsEditorInstance; }
export function getFinalEditor() { return finalEditorInstance; }