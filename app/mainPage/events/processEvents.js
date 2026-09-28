// app/mainPage/events/processEvents.js

import { main, currentSectionPortfolio, makeTestArray, makeReport } from '../../../main.js';

import {
  inputText,
  processBtn,
  emojiDescription,
  copyStatus,
  copyBtn,
  editText,
  h2,
  minH2
} from '../config/selectors.js';

import {
  displayArray,
  setDisplayArray,
  currentIndex,
  setCurrentIndex
} from '../../pageControl/state/appState.js';

import { renderList } from '../ui/renderList.js';
import { renderCheckTxts } from '../ui/renderChecks.js';
import { renderReport } from '../ui/renderReport.js';
import { expReportDisplay } from '../ui/renderExpReport.js';
import { renderCPinOrder } from '../ui/renderCPinOrder.js';

import { updateCoachViewSections } from '../../coachPage/ui/renderCoachView.js';
import { renderSaljaProSections } from '../../coachPage/ui/renderSaljaProView.js';

export function setupProcessEvents() {
  processBtn.addEventListener('click', () => {
    const lines = inputText.value.split('\n');

    makeTestArray(lines);

    const result = main(lines);

    setDisplayArray(result);

    makeReport();

    setCurrentIndex(0);

    renderList();

    editText.value = displayArray[0]?.text || '';

    inputText.style.display = 'none';
    processBtn.style.display = 'none';
    emojiDescription.style.display = 'flex';

    const buttonRow = document.querySelector('.button-row');
    if (buttonRow) {
      buttonRow.style.display = 'flex';
    }

    copyStatus.style.display = 'block';
    copyBtn.style.display = 'block';
    editText.style.display = 'block';
    h2.style.display = 'block';
    minH2.style.display = 'block';

    renderCheckTxts();
    renderReport();
    expReportDisplay();

    renderCPinOrder(currentSectionPortfolio);
    updateCoachViewSections(currentSectionPortfolio);
    renderSaljaProSections(currentSectionPortfolio);
  });

  editText.addEventListener('input', () => {
    if (displayArray.length === 0) return;

    const text = editText.value;

    displayArray[currentIndex].text = text;

    if (text.length > 100) {
      editText.classList.add('text-too-long');
    } else {
      editText.classList.remove('text-too-long');
    }
  });
}