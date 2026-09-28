// app/coachPage/ui/renderSaljaProView.js

import { saljaProMainContainer, saljaProSubContainers } from '../../coachPage/config/selectors.js';
import { 
  getHeaderCheckboxConfig, 
  getHeaderCheckboxHtml, 
  setupHeaderCheckboxEventListener 
} from './renderSaljaCheckBoxes.js';

import { createQuillEditor } from '../../pageControl/utils/quillSetup.js';

const saljaProEditors = new Map();

/**
 * Hjälpfunktion för att kontrollera om någon underliggande subcontainer innehåller text.
 */
function hasAnySubText() {
  let hasText = false;
  saljaProEditors.forEach((quill) => {
    if (quill && quill.getText().trim().length > 0) {
      hasText = true;
    }
  });
  return hasText;
}

/**
 * Kontrollerar om någon underliggande subcontainer innehåller text och uppdaterar huvudcontainern.
 */
export function updateSaljaProMainContainerState() {
  const mainCont = saljaProMainContainer || document.getElementById('saljaProMainContainer');
  if (!mainCont) return;

  const hasContent = hasAnySubText();
  const mainBtn = mainCont.querySelector('#saljaProMainBtn') || document.getElementById('saljaProMainBtn');
  const isMainExpanded = mainBtn?.classList.contains('active') || mainCont.classList.contains('active');

  // 1. Hantera is-empty och has-content
  if (hasContent) {
    mainCont.classList.add('has-content');
    mainCont.classList.remove('is-empty');
  } else {
    if (!isMainExpanded) {
      mainCont.classList.remove('has-content');
    }
    mainCont.classList.add('is-empty');
  }

  // 2. Hantera disabled-state (grå bakgrund/inaktiv stil när den är stängd och tom)
  if (isMainExpanded || hasContent) {
    mainCont.classList.remove('disabled-state');
  } else {
    mainCont.classList.add('disabled-state');
  }
}

/**
 * Initierar och kopplar klickhändelser för SäljaPro Huvudcontainer.
 */
export function initSaljaProMainEvents() {
  const mainCont = saljaProMainContainer || document.getElementById('saljaProMainContainer');
  const subConts = saljaProSubContainers || document.getElementById('saljaProSubContainers');
  if (!mainCont) return;

  const mainBtn = mainCont.querySelector('#saljaProMainBtn') || document.getElementById('saljaProMainBtn');
  const header = mainCont.querySelector('.expandable-header');

  if (!mainBtn) return;

  // Synka synlighet och tillstånd baserat på nuvarande active-status
  const syncSubVisibility = () => {
    const isExpanded = mainCont.classList.contains('active');
    
    if (isExpanded) {
      mainCont.classList.remove('disabled-state');
      mainBtn.classList.add('active');
    } else {
      mainBtn.classList.remove('active');
      // Om stängd och saknar innehåll -> bli grå (disabled-state)
      if (!hasAnySubText()) {
        mainCont.classList.add('disabled-state');
      }
    }

    if (subConts) {
      subConts.style.display = isExpanded ? 'flex' : 'none';
    }
  };

  if (mainCont.dataset.eventsInitialized === 'true') {
    syncSubVisibility();
    return;
  }
  
  mainCont.dataset.eventsInitialized = 'true';

  const toggleMain = (e) => {
    if (e && e.target.closest('input, .approved-radio-label, .approved-group')) return;

    const isExpanded = mainCont.classList.toggle('active');
    mainBtn.classList.toggle('active', isExpanded);

    syncSubVisibility();
    updateSaljaProMainContainerState();
  };

  mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMain(e);
  });

  if (header) {
    header.addEventListener('click', (e) => {
      if (e.target.closest('#saljaProMainBtn')) return;
      toggleMain(e);
    });
  }

  // Kör en initial synkning
  syncSubVisibility();
}

/**
 * Renderar dynamiska SäljaPro sub-containers utifrån sectionPortfolio.returnHeaders()
 */
export function renderSaljaProSections(sectionPortfolio) {
  const mainCont = saljaProMainContainer || document.getElementById('saljaProMainContainer');
  const subConts = saljaProSubContainers || document.getElementById('saljaProSubContainers');

  if (!mainCont || !subConts) return;

  subConts.innerHTML = '';
  saljaProEditors.clear();

  const headers = sectionPortfolio?.returnHeaders ? sectionPortfolio.returnHeaders() : [];

  if (!headers || headers.length === 0) {
    mainCont.style.display = 'none';
    return;
  }

  let createdCount = 0;

  headers.forEach((header, index) => {
    let titleText = '';
    const headerType = header.constructor.name;

    switch (headerType) {
      case 'CombinationHeader': {
        const flagTxt = header.forFlagTxt !== undefined ? ` för ${header.forFlagTxt}` : '';
        titleText = `${header.number}. ${header.description}${flagTxt}`;
        break;
      }
      case 'OpenHeader':
      case 'CombinationFreeStanding':
        titleText = `${header.number}. ${header.description}`;
        break;
      case 'SecondStageHeader':
        titleText = header.originalTxt || '';
        break;
      default:
        return;
    }

    if (!titleText) return;

    createdCount++;
    const subId = `saljaProSub_${index}`;
    const btnId = `saljaProBtn_${index}`;
    const editorId = `saljaProEditor_${index}`;

    const checkboxConfig = getHeaderCheckboxConfig(header, titleText);
    const checkboxHtml = getHeaderCheckboxHtml(checkboxConfig);

    const subContainer = document.createElement('div');
    subContainer.className = 'expandable-container disabled-state is-empty salja-pro-sub-item';
    subContainer.id = subId;

    subContainer.innerHTML = `
      <div class="expandable-header">
        <button type="button" id="${btnId}" class="expand-btn" aria-label="Expandera"></button>
        <span class="expandable-label" style="cursor: pointer;">${titleText}</span>
        ${checkboxHtml}
      </div>
      <div id="${editorId}"></div>
    `;

    subConts.appendChild(subContainer);

    // Skapa Quill-editor
    const quill = createQuillEditor(`#${editorId}`);

    if (quill) {
      saljaProEditors.set(editorId, quill);

      if (checkboxConfig) {
        setupHeaderCheckboxEventListener(subContainer, quill);
      }

      setupSubSectionEvents(subContainer, btnId, quill);
    }
  });

  if (createdCount > 0) {
    mainCont.style.display = 'block';
  } else {
    mainCont.style.display = 'none';
  }

  // Synka och initiera händelser
  initSaljaProMainEvents();
  updateSaljaProMainContainerState();
}

function setupSubSectionEvents(container, btnId, quill) {
  const btn = container.querySelector(`#${btnId}`);
  const header = container.querySelector('.expandable-header');
  if (!btn) return;

  const hasTextContent = () => quill.getText().trim().length > 0;
  const isExpanded = () => btn.classList.contains('active');

  const syncState = () => {
    // 1. Öppen / Stängd redigering
    if (isExpanded()) {
      const wasDisabled = container.classList.contains('disabled-state');
      container.classList.remove('disabled-state');
      container.classList.add('active');
      quill.enable(true);

      if (wasDisabled) {
        setTimeout(() => quill.focus(), 50);
      }
    } else {
      container.classList.add('disabled-state');
      container.classList.remove('active');
      quill.enable(false);
    }

    // 2. Bakgrundsfärg för SUB-CONTAINERN
    if (isExpanded() || hasTextContent()) {
      container.classList.add('has-content');
    } else {
      container.classList.remove('has-content');
    }

    // 3. Markera om sub-containern är tom eller har text
    if (hasTextContent()) {
      container.classList.remove('is-empty');
    } else {
      container.classList.add('is-empty');
    }

    // 4. Uppdatera även HUVUDCONTAINERNS tillstånd
    updateSaljaProMainContainerState();
  };

  const toggleExpand = (e) => {
    if (e && e.target.closest('input, .approved-radio-label, .approved-group')) return;

    btn.classList.toggle('active');
    syncState();
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    syncState();
  });

  if (header) {
    header.addEventListener('click', (e) => {
      if (e.target.closest(`#${btnId}`)) return;
      toggleExpand(e);
    });
  }

  // När text ändras i editorn, synka tillstånden
  quill.on('text-change', () => {
    syncState();
  });
}