import { PROFILE_COLORS, MATERIAL_CONFIGS } from '../config/constants.js';

export function createSusRailUI(containerEl) {
  containerEl.innerHTML = `
    <div class="sus-rail-card">
      <h1>Antals- beräkning</h1>
      <div class="sus-tabs-header">
        <button type="button" class="sus-tab-btn active" data-material="RAIL" id="tab-btn-RAIL">
          ${MATERIAL_CONFIGS.RAIL.shortTitle}
        </button>
        <button type="button" class="sus-tab-btn" data-material="PLINTH" id="tab-btn-PLINTH">
          ${MATERIAL_CONFIGS.PLINTH.shortTitle}
        </button>
        <button type="button" class="sus-tab-btn" data-material="MOLDING" id="tab-btn-MOLDING">
          ${MATERIAL_CONFIGS.MOLDING.shortTitle}
        </button>
      </div>

      ${Object.keys(MATERIAL_CONFIGS).map(key => {
        const config = MATERIAL_CONFIGS[key];
        return `
          <div id="tab-content-${config.id}" class="sus-tab-content ${config.id === 'RAIL' ? 'active' : ''}">
            <div class="sus-tab-title-row">
              <h2>${config.title} (${config.length} mm)</h2>
              <button type="button" class="sus-clear-btn" id="susClearBtn-${config.id}" data-material="${config.id}">
                Radera beräkning
              </button>
            </div>
            
            <p class="sus-rail-desc">Mata in mått (t.ex. 600+600+400) och tryck Enter. Du kan klicka på ett mått för att ta bort det.</p>
            
            <div class="sus-rail-input-wrapper">
              <input type="text" id="susInput-${config.id}" class="calc-input sus-input-field" placeholder="Skriv mått i mm (t.ex. 600+600+400)..." />
              <div id="susList-${config.id}" class="sus-rail-list"></div>
            </div>

            <button type="button" id="susCalcBtn-${config.id}" class="control-btn chain-btn sus-calc-btn">
              Beräkna ${config.shortTitle}
            </button>

            <div id="susResults-${config.id}" class="sus-rail-results"></div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderList(listEl, measurements) {
  listEl.innerHTML = measurements
    .map((m, idx) => {
      const val = typeof m === 'object' ? m.val : m;
      const itemId = typeof m === 'object' ? m.id : idx;
      const color = PROFILE_COLORS[idx % PROFILE_COLORS.length];

      return `
        <div class="sus-list-item" data-index="${idx}" data-id="${itemId}" title="Klicka för att ta bort" style="border-left: 5px solid ${color};">
          <span>${val} mm</span> <span class="sus-remove-icon">&times;</span>
        </div>
      `;
    })
    .join('');
}

export function renderResults(resultsContainer, calculation, materialConfig) {
  const { rails } = calculation;
  const { title, shortTitle, length } = materialConfig;

  if (!rails || rails.length === 0) {
    resultsContainer.innerHTML = '<p class="sus-empty-msg">Inga mått inmatade.</p>';
    return;
  }

  const itemsHtml = rails.map((rail, index) => {
    const segmentsHtml = rail.items.map(item => {
      const widthPct = (item.value / length) * 100;
      const itemColor = PROFILE_COLORS[item.measureId % PROFILE_COLORS.length];
      return `<div class="sus-bar-segment" style="width: ${widthPct}%; background-color: ${itemColor};" title="${item.value} mm">${item.value}</div>`;
    }).join('');

    const wasteHtml = rail.remaining > 0
      ? `<div class="sus-bar-segment waste" style="width: ${(rail.remaining / length) * 100}%;" title="Spill: ${rail.remaining} mm">${rail.remaining}</div>`
      : '';

    const detailsHtml = rail.items.map(i => {
      const c = PROFILE_COLORS[i.measureId % PROFILE_COLORS.length];
      return `<strong style="color: ${c};">${i.value} mm</strong>`;
    }).join(', ');

    return `
      <div class="sus-rail-item" style="border-left: 6px solid #000000;">
        <div class="sus-rail-header">
          <span class="sus-rail-badge" style="background-color: #000000; color: #ffffff;">${shortTitle} ${index + 1}</span>
          <span class="sus-rail-usage">Använt: ${rail.used} mm / Spill: ${rail.remaining} mm</span>
        </div>
        <div class="sus-bar-container">
          ${segmentsHtml}
          ${wasteHtml}
        </div>
        <div class="sus-rail-details">
          Mått i denna ${shortTitle.toLowerCase()}: ${detailsHtml}
        </div>
      </div>
    `;
  }).join('');

  resultsContainer.innerHTML = `
    <div class="sus-summary-box">
      Totalt antal <strong>${title.toLowerCase()}</strong> som behövs: <strong>${rails.length} st</strong>
    </div>
    <div class="sus-rails-grid">
      ${itemsHtml}
    </div>
  `;
}