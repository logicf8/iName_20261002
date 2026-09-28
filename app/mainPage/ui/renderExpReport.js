// app\mainPage\ui\renderExpReport.js

import { currentSectionPortfolio } from '../../../main.js';

const containerExp = document.querySelector('.reportExpContainer');

export function expReportDisplay() {
  if (currentSectionPortfolio.expAlert.length > 0) {
    containerExp.style.display = 'grid';

    containerExp.innerHTML = '';

    const warningTitle = document.createElement('h3');

    warningTitle.textContent =
      '🔔 Varning följande artiklar har utgått och kommer inte att importeras!';

    containerExp.appendChild(warningTitle);

    currentSectionPortfolio.expAlert.forEach(product => {
      const p = document.createElement('p');

      p.textContent =
        `⇝ ${product.name} | ` +
        `${product.description.toLowerCase()} | ` +
        `${product.artNr}`;

      containerExp.appendChild(p);
    });
  }
}