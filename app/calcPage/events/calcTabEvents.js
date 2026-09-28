// app/calcPage/events/calcTabEvents.js

import { initCoverPanel } from '../coverPanelPage/cabinetManager/cabinetManager.js';

export function setupCalcTabEvents() {
  const tabButtons = document.querySelectorAll('.calc-main-tabs .calc-tab-btn');
  const tabContents = document.querySelectorAll('.calc-tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabKey = btn.dataset.tab; // t.ex. "mattkedjan" eller "susrail"

      // 1. Ta bort active-klass och dölj alla flikar
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
      });

      // 2. Aktivera den klickade knappen
      btn.classList.add('active');

      // 3. Hitta och visa målfliken (ID är skrivet som "tab-mattkedjan" respektive "tab-susrail")
      const targetContent = document.getElementById(`tab-${targetTabKey}`) || document.getElementById(targetTabKey);

      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
      }

      // 4. Hantera specifik fokus/input för respektive flik
      if (targetTabKey === 'mattkedjan') {
        const calcInput = document.getElementById('calc-input');
        if (calcInput) {
          setTimeout(() => calcInput.focus(), 50);
        }
      } else if (targetTabKey === 'susrail') {
        // Om SusRail har några egna inputfält som behöver fokusera eller uppdateras vid visning:
        const susRailInput = document.querySelector('#tab-susrail input');
        if (susRailInput) {
          setTimeout(() => susRailInput.focus(), 50);
        }
      } else if (targetTabKey === 'coverPanel') {
        initCoverPanel();
        const coverPanelInput = document.querySelector('#tab-coverPanel input');
        if (coverPanelInput) {
          setTimeout(() => coverPanelInput.focus(), 50);
        }
      }

    });
  });
}