// app/coachPage/events/coachEvents.js

import { 
  coachText, sellerText, customerText,
  nkpBtn, 
  wtBtn, wtStatusRadios,
  wpBtn, wpStatusRadios,
  hrBtn, hrStatusCheckbox,
  ovrigtBtn, tipsBtn,
  finalBtn, finalSelect
} from '../config/selectors.js';

import { 
  initCoachPage,
  initCoachEditors, 
  getNkpEditor, 
  getWtEditor, 
  getWpEditor,
  getHrEditor,
  getOvrigtEditor,
  getTipsEditor,
  getFinalEditor
} from '../ui/renderCoachView.js';

import { initSaljaProMainEvents } from '../ui/renderSaljaProView.js';

let lastFocusedCoachElement = coachText;

export function focusLastCoachElement() {
  const elementToFocus = lastFocusedCoachElement || coachText || document.getElementById('coachText');
  if (elementToFocus && typeof elementToFocus.focus === 'function') {
    setTimeout(() => elementToFocus.focus(), 50);
  }
}

export function setupCoachEvents() {
  initCoachPage();
  initCoachEditors();

  const cText = coachText || document.getElementById('coachText');
  const sText = sellerText || document.getElementById('sellerText');
  const custText = customerText || document.getElementById('customerText');

  [cText, sText, custText].forEach(field => {
    if (field) {
      field.addEventListener('focus', () => {
        lastFocusedCoachElement = field;
      });
    }
  });

  // Logik för Combobox (finalSelect) med FETSTIL på enbart selekterad text
  let previousSelectedText = '';

  const selectEl = finalSelect || document.getElementById('finalSelect');
  if (selectEl) {
    selectEl.addEventListener('change', (e) => {
      const newText = e.target.value;
      const editor = getFinalEditor();
      if (!editor) return;

      const currentContent = editor.getText(); // Hämtar ren text från editorn

      if (previousSelectedText && currentContent.startsWith(previousSelectedText)) {
        // Om tidigare valt alternativ fanns längst upp, ta bort det
        let deleteLength = previousSelectedText.length;
        if (currentContent.startsWith(previousSelectedText + '\n')) {
          deleteLength += 1; // Ta även bort radbrytningen efter
        }
        editor.deleteText(0, deleteLength);
      }

      if (newText) {
        // Infoga den nya texten längst upp i FETSTIL
        const textToInsert = newText + '\n';
        editor.insertText(0, textToInsert, { bold: true });
        
        // Återställ formatet så att ny text som skrivs manuellt efteråt inte är fet som standard
        editor.formatText(textToInsert.length, 0, { bold: false });
      }

      previousSelectedText = newText;
    });
  }

  function setupSectionBtn(btnElement, statusRadios, getEditor) {
    const btn = btnElement || (typeof btnElement === 'string' ? document.getElementById(btnElement) : null);
    if (!btn) return;

    const container = btn.closest('.expandable-container');
    if (!container) return;

    const header = container.querySelector('.expandable-header');

    const hasTextContent = () => {
      const editor = getEditor ? getEditor() : null;
      if (!editor) return false;
      return editor.getText().trim().length > 0;
    };

    const isAnyStatusSelected = () => {
      if (!statusRadios || statusRadios.length === 0) return false;
      return Array.from(statusRadios).some(r => r.checked);
    };

    const isSectionExpanded = () => btn.classList.contains('active');

    const shouldBeActiveBackground = () => 
      isSectionExpanded() || 
      isAnyStatusSelected() || 
      hasTextContent();

    const syncState = () => {
      if (!container) return;

      if (isSectionExpanded()) {
        const wasDisabled = container.classList.contains('disabled-state');
        container.classList.remove('disabled-state');

        if (wasDisabled && getEditor) {
          const editor = getEditor();
          if (editor) {
            setTimeout(() => editor.focus(), 50);
          }
        }
      } else {
        container.classList.add('disabled-state');
      }

      if (shouldBeActiveBackground()) {
        container.classList.add('has-content');
      } else {
        container.classList.remove('has-content');
      }
    };

    const checkEditorContent = () => {
      if (!container) return;

      if (hasTextContent()) {
        container.classList.remove('is-empty');
      } else {
        container.classList.add('is-empty');
      }

      syncState();
    };

    const toggleSection = () => {
      btn.classList.toggle('active');
      syncState();
    };

    syncState();

    setTimeout(() => {
      checkEditorContent();
      const editor = getEditor ? getEditor() : null;
      if (editor) {
        editor.on('text-change', checkEditorContent);

        editor.on('selection-change', (range) => {
          if (range && range.length >= 0) {
            lastFocusedCoachElement = editor;
          }
        });
      }
    }, 100);

    if (header) {
      header.addEventListener('click', (e) => {
        // VIKTIGT: Ignorera klick på input, radio, select och select-grupp så att inte containern fälls ihop
        if (e.target.closest('input, select, .final-select-group, .approved-radio-label, .approved-group')) {
          return;
        }

        if (e.target.closest('.expandable-label')) {
          e.preventDefault();
        }

        toggleSection();
      });
    }

    if (statusRadios && statusRadios.length > 0) {
      statusRadios.forEach(radio => {
        radio.addEventListener('click', () => {
          if (radio.dataset.wasChecked === 'true') {
            radio.checked = false;
            radio.dataset.wasChecked = 'false';
          } else {
            statusRadios.forEach(r => r.dataset.wasChecked = 'false');
            radio.dataset.wasChecked = 'true';
          }
          syncState();
        });

        radio.addEventListener('change', syncState);
      });
    }
  }

  // Initiera alla sektioner
  setupSectionBtn(nkpBtn || document.getElementById('nkpBtn'), null, getNkpEditor);
  setupSectionBtn(wtBtn || document.getElementById('wtBtn'), wtStatusRadios, getWtEditor);
  setupSectionBtn(wpBtn || document.getElementById('wpBtn'), wpStatusRadios, getWpEditor);
  setupSectionBtn(hrBtn || document.getElementById('hrBtn'), hrStatusCheckbox ? [hrStatusCheckbox] : null, getHrEditor);
  setupSectionBtn(ovrigtBtn || document.getElementById('ovrigtBtn'), null, getOvrigtEditor);
  setupSectionBtn(tipsBtn || document.getElementById('tipsBtn'), null, getTipsEditor);
  setupSectionBtn(finalBtn || document.getElementById('finalBtn'), null, getFinalEditor);

  // Initiera SäljaPro-händelser
  initSaljaProMainEvents();
}