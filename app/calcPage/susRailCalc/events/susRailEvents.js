import { calculateProfileCuts } from '../utils/railOptimizer.js';
import { renderResults, renderList } from '../ui/renderSusRail.js';
import { MATERIAL_CONFIGS } from '../config/constants.js';

/**
 * Utvärderar enkla additionssatser säkert (t.ex. "600+600+400+3")
 */
function parseMeasurementInput(rawText) {
  if (!rawText) return null;
  const cleaned = rawText.replace(/,/g, '.').replace(/[^0-9+. ]/g, '');
  if (!cleaned.trim()) return null;

  const parts = cleaned.split('+');
  let total = 0;

  for (const part of parts) {
    const val = parseFloat(part.trim());
    if (!isNaN(val) && val > 0) {
      total += val;
    }
  }

  return total > 0 ? Math.round(total) : null;
}

export function setupSusRailEvents(container) {
  const store = {
    RAIL: [],
    PLINTH: [],
    MOLDING: []
  };

  // Event Delegation för Tab-växling (undviker multipla event listeners på varje knapp)
  const tabsHeader = container.querySelector('.sus-tabs-header');
  if (tabsHeader) {
    tabsHeader.addEventListener('click', (e) => {
      const btn = e.target.closest('.sus-tab-btn');
      if (!btn) return;

      const targetMaterial = btn.dataset.material;
      const tabBtns = container.querySelectorAll('.sus-tab-btn');
      const tabContents = container.querySelectorAll('.sus-tab-content');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = container.querySelector(`#tab-content-${targetMaterial}`);
      if (activeContent) activeContent.classList.add('active');
    });
  }

  // 2. Koppla händelser för varje materialtyp
  Object.keys(MATERIAL_CONFIGS).forEach(materialKey => {
    const config = MATERIAL_CONFIGS[materialKey];
    const inputEl = container.querySelector(`#susInput-${config.id}`);
    const listEl = container.querySelector(`#susList-${config.id}`);
    const calcBtn = container.querySelector(`#susCalcBtn-${config.id}`);
    const resultsEl = container.querySelector(`#susResults-${config.id}`);
    const clearBtn = container.querySelector(`#susClearBtn-${config.id}`);
    const tabBtn = container.querySelector(`#tab-btn-${config.id}`);

    if (!inputEl || !listEl || !calcBtn || !resultsEl || !clearBtn || !tabBtn) return;

    // Enter för att lägga till mått
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = parseMeasurementInput(inputEl.value.trim());

        if (val !== null) {
          store[config.id].push(val);
          inputEl.value = '';
          renderList(listEl, store[config.id]);
        }
      }
    });

    // Radera enskilt mått genom att klicka på det i listan
    listEl.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.sus-list-item');
      if (itemEl) {
        const index = parseInt(itemEl.dataset.index, 10);
        if (!isNaN(index)) {
          store[config.id].splice(index, 1);
          renderList(listEl, store[config.id]);
        }
      }
    });

    // Beräkna om
    calcBtn.addEventListener('click', () => {
      const res = calculateProfileCuts(store[config.id], config.length);
      renderResults(resultsEl, res, config);

      if (res.rails && res.rails.length > 0) {
        clearBtn.classList.add('visible');
        tabBtn.textContent = `${config.shortTitle}: ${res.rails.length} st`;
      } else {
        clearBtn.classList.remove('visible');
        tabBtn.textContent = config.shortTitle;
      }
    });

    // Radera beräkning för detta material
    clearBtn.addEventListener('click', () => {
      store[config.id] = [];
      renderList(listEl, []);
      resultsEl.innerHTML = '';
      clearBtn.classList.remove('visible');
      tabBtn.textContent = config.shortTitle;
    });
  });
}