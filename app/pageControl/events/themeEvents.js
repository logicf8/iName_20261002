// app\pageControl\events\themeEvents.js

import { main as processText } from '../../../main.js';
import { setEmojiTheme } from '../../../core/4_generators/descriptionGenerator/displayTxtHelpers.js';

// Globala temaselektorer
import {
  themeToggleRadios,
  stylesheet,
  heading
} from '../config/selectors.js';

// Selektorer från mainPage
import { inputText } from '../../mainPage/config/selectors.js';

import {
  setDisplayArray,
  setCurrentTheme
} from '../state/appState.js';

import { renderList } from '../../mainPage/ui/renderList.js';
import { renderCheckTxts } from '../../mainPage/ui/renderChecks.js';
import { updateEmojiDescriptions } from '../../mainPage/ui/theme.js';

export function setupThemeEvents() {
  themeToggleRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const selectedTheme = e.target.value; // 'default' | 'pink' | 'black'

      const checkContainer = document.querySelector('.checkMainContainer');
      const isVisible =
        checkContainer &&
        window.getComputedStyle(checkContainer).display !== 'none';

      // Hantera temabytet
      if (selectedTheme === 'pink') {
        setCurrentTheme('pink');
        stylesheet.href = './app/pageControl/styles/theme-pink.css';
        heading.textContent = 'iName 🪷 Pinkified';
        setEmojiTheme('pink');
        updateEmojiDescriptions('pink');
      } else if (selectedTheme === 'black') {
        setCurrentTheme('black');
        stylesheet.href = './app//pageControl/styles/theme-black.css';
        heading.textContent = 'iName 🥂 CopyTool';
        setEmojiTheme('black');
        updateEmojiDescriptions('black');
      } else {
        // Default (Blue)
        setCurrentTheme('default');
        stylesheet.href = './app/pageControl/styles/theme-blue.css';
        heading.textContent = 'iName | CopyTool';
        setEmojiTheme('default');
        updateEmojiDescriptions('default');
      }

      // Ombearbeta text & rita om listor vid temabyte
      const lines = inputText.value.split('\n');
      const result = processText(lines);
      
      setDisplayArray(result);
      renderList();

      if (isVisible) {
        renderCheckTxts();
      }
    });
  });
}