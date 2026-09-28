// app\mainPage\events\keyboardEvents.js

import {
  displayArray,
  currentIndex,
  setCurrentIndex,
  currentView
} from '../../pageControl/state/appState.js';

import { renderList } from '../ui/renderList.js';
import { copyCurrentLine } from '../services/clipboardService.js';

export function setupKeyboardEvents() {
  document.addEventListener('keydown', e => {
    // 1. Kör KUN om mainView är aktiv
    if (currentView !== 'main') return;

    // 2. Inaktivera om användaren står i ett textfält/input
    const activeElem = document.activeElement;
    if (
      activeElem &&
      (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA')
    ) {
      return;
    }

    if (displayArray.length === 0) return;

    if (e.key === 'ArrowDown') {
      setCurrentIndex(Math.min(currentIndex + 1, displayArray.length - 1));
      renderList();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setCurrentIndex(Math.max(currentIndex - 1, 0));
      renderList();
      e.preventDefault();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      copyCurrentLine();
    }
  });
}