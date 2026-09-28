// app\mainPage\ui\renderReport.js

import { currentSectionPortfolio } from '../../../main.js';

export function renderReport() {
  const container = document.querySelector('.reportContainer');

  container.style.display = 'grid';

  container.innerHTML = '';

  currentSectionPortfolio.reportTxts.forEach(item => {
    const reportItem = document.createElement('div');

    reportItem.classList.add('reportItem');

    reportItem.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <span class="infoEmoji" title="${item.info}">🛈</span>
      </div>
      <div>${item.text1}</div>
      <div>${item.text2}</div>
    `;

    container.appendChild(reportItem);
  });
}