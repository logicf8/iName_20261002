//app\coachPage\ui\renderSaljaCheckBoxes.js

/**
 * Hanterar infogande och borttagning av en specifik textrad i Quill-editorn baserat på checkbox-status.
 */
export function handleCheckboxToggle(isChecked, quill, targetText) {
  if (!quill || !targetText) return;

  const currentText = quill.getText();

  if (isChecked) {
    if (!currentText.includes(targetText)) {
      if (currentText.trim().length > 0) {
        quill.insertText(0, targetText + '\n');
      } else {
        quill.setText(targetText + '\n');
      }
    }
  } else {
    if (currentText.includes(targetText)) {
      const fullText = quill.getText();
      if (fullText.startsWith(targetText + '\n')) {
        quill.deleteText(0, targetText.length + 1);
      } else if (fullText.startsWith(targetText)) {
        quill.deleteText(0, targetText.length);
      }
    }
  }
}

/**
 * Identifierar om en header ska ha en särskild checkbox och returnerar dess konfiguration.
 */

export function getHeaderCheckboxConfig(header, titleText) {
  // Använd titleText i första hand, annars originalTxt
  const textToSearch = titleText || header?.originalTxt || '';
  const lowerTxt = textToSearch.toLowerCase();

  // 1. Borrmall (Handtag / Knoppar)
  if (lowerTxt.includes('handtag') || lowerTxt.includes('knoppar')) {
    return {
      type: 'borrmall',
      label: 'Borrmall',
      insertText: 'Lägg till borrmall'
    };
  }

  // 2. Se utskrift (Täcksidor)
  if (lowerTxt.includes('täcksidor') || lowerTxt.includes('täcksida')) {
    return {
      type: 'seUtskrift',
      label: 'Se utskrift',
      insertText: 'Korrigera enligt notiser i hantverksritning. '
    };
  }

  // 3. Rör (Fläkt)
  if (lowerTxt.includes('fläkt')) {
    return {
      type: 'ror',
      label: 'Rör',
      insertText: 'Lägg till fläktrör'
    };
  }

  return null;
}

/**
 * Genererar HTML-strukturen för en dynamisk checkbox i headern.
 */
export function getHeaderCheckboxHtml(config) {
  if (!config) return '';

  return `
    <div class="approved-group">
      <label class="approved-radio-label">
        <input type="checkbox" class="salja-pro-header-checkbox approved-radio" data-insert-text="${config.insertText}">
        <span class="custom-checkbox"></span>
        <span class="label-text-screen">${config.label}</span>
      </label>
    </div>
  `;
}

/**
 * Kopplar eventlyssnaren för den genererade checkboxen i sub-containern.
 */
export function setupHeaderCheckboxEventListener(subContainer, quill) {
  const checkbox = subContainer.querySelector('.salja-pro-header-checkbox');
  if (checkbox) {
    const insertText = checkbox.dataset.insertText;
    checkbox.addEventListener('change', (e) => {
      handleCheckboxToggle(e.target.checked, quill, insertText);
    });
  }
}