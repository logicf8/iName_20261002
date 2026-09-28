// app\mainPage\services\clipboardService.js

import {
  copyStatus,
  displayList
} from '../config/selectors.js';

import {
  displayArray,
  currentIndex,
  setCurrentIndex,
  lastBoldIndex,
  setLastBoldIndex
} from '../../pageControl/state/appState.js';

import { renderList } from '../ui/renderList.js';

export function copyCurrentLine() {
  if (displayArray.length === 0) return;

  const text = displayArray[currentIndex]?.text || '';

  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    if (
      lastBoldIndex !== null &&
      lastBoldIndex !== currentIndex
    ) {
      const prevLi = displayList.children[lastBoldIndex];

      if (prevLi) {
        prevLi.style.fontWeight = 'normal';
      }
    }

    const currentLi = displayList.children[currentIndex];

    if (currentLi) {
      currentLi.style.fontWeight = 'bold';
    }

    setLastBoldIndex(currentIndex);

    setCurrentIndex(
      Math.min(currentIndex + 1, displayArray.length - 1)
    );

    renderList();
  });
}

export function copyCustomText(text) {
  navigator.clipboard.writeText(text).then(() => {
    copyStatus.textContent = text;

    setLastBoldIndex(null);

    renderList();
  });
}