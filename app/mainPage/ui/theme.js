// app\mainPage\ui\theme.js

import {
  missingH3,
  expH3
} from '../config/selectors.js';

export function updateEmojiDescriptions(theme) {
  if (theme === 'black') {
    missingH3.textContent = '[🕯️] = text kan behöva korrigeras';
    expH3.textContent = '[✨] = innehåller produkt som har utgått';
  } else if (theme === 'pink') {
    missingH3.textContent = '[🌸] = text kan behöva korrigeras';
    expH3.textContent = '[🧁] = innehåller produkt som har utgått';
  } else {
    // Default / Blue
    missingH3.textContent = '[🚨] = text kan behöva korrigeras';
    expH3.textContent = '[🔔] = innehåller produkt som har utgått';
  }
}