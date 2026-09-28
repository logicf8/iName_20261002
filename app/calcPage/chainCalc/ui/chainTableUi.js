import { 
    PRESET_DEPTHS, 
    DEFAULT_DEPTH, 
    calculateEffectiveLength, 
    calculateLopmeter, 
    calculateKvadrat 
} from '../utils/chainTableUtils.js';
import { createTableRowElement } from './chainTableRow.js';

export function getOrCreateChainTable() {
    let tableWrapper = document.getElementById('chain-table-wrapper');
    const chainsContainer = document.getElementById('chains-container');

    // Skapa rubriken för "Måttkedja ritning" om den inte finns
    if (chainsContainer && !document.getElementById('chains-title')) {
        const title = document.createElement('h2');
        title.id = 'chains-title';
        title.textContent = 'Måttkedja ritning';
        chainsContainer.parentNode.insertBefore(title, chainsContainer);
    }

    if (!tableWrapper && chainsContainer) {
        tableWrapper = document.createElement('div');
        tableWrapper.id = 'chain-table-wrapper';
        tableWrapper.className = 'chain-table-wrapper';
        tableWrapper.style.display = 'none';

        tableWrapper.innerHTML = `
            <table class="chain-table" id="chain-table">
                <thead>
                    <tr>
                        <th class="col-length">Längd</th>
                        <th class="col-depth">Djup</th>
                        <th class="col-kvadrat">m²</th>
                        <th class="col-lopmeter">Löpm.</th>
                        <th class="col-actions">Åtgärd</th>
                    </tr>
                </thead>
                <tbody id="chain-table-body"></tbody>
            </table>
        `;

        // Skapa rubriken för "SäljaPro textrad"
        const tableTitle = document.createElement('h2');
        tableTitle.id = 'saljapro-title';
        tableTitle.textContent = 'SäljaPro textrad';

        // Sätt in rubriken och tabellen efter chainsContainer
        chainsContainer.parentNode.insertBefore(tableTitle, chainsContainer.nextSibling);
        chainsContainer.parentNode.insertBefore(tableWrapper, tableTitle.nextSibling);
    }

    return tableWrapper;
}

export function updateTableVisibility() {
    const tableWrapper = document.getElementById('chain-table-wrapper');
    const tbody = document.getElementById('chain-table-body');
    if (!tableWrapper || !tbody) return;

    if (tbody.children.length > 0) {
        tableWrapper.style.display = 'block';
    } else {
        tableWrapper.style.display = 'none';
    }
}

export function addTableRow(chainId, groupLengths, state, dSplit = null) {
    const tableWrapper = getOrCreateChainTable();
    const tbody = document.getElementById('chain-table-body');
    if (!tbody) return;

    const lengths = Array.isArray(groupLengths) ? groupLengths : [groupLengths];

    lengths.forEach((groupLengthMm, index) => {
        let effectiveLengthMm = groupLengthMm;

        if (state && state.isDepthActive) {
            const isFirstGroup = (index === 0);
            const isLastGroup = (index === lengths.length - 1);

            if (isFirstGroup && (state.side === 'left' || state.side === 'both')) {
                effectiveLengthMm -= (state.depthLeftVal || 0);
            }
            if (isLastGroup && (state.side === 'right' || state.side === 'both')) {
                effectiveLengthMm -= (state.depthRightVal || 0);
            }
        }

        effectiveLengthMm = Math.max(0, effectiveLengthMm);

        const row = createTableRowElement(chainId, effectiveLengthMm, dSplit);
        tbody.appendChild(row);
    });

    updateTableVisibility();
}

export function removeTableRow(chainId) {
    const tbody = document.getElementById('chain-table-body');
    if (!tbody) return;

    const rows = tbody.querySelectorAll(`tr[data-chain-id="${chainId}"]`);
    rows.forEach(row => row.remove());
    updateTableVisibility();
}

export function clearTable() {
    const tbody = document.getElementById('chain-table-body');
    if (tbody) {
        tbody.innerHTML = '';
    }
    
    updateTableVisibility();

    // Ta bort VP-tabellen om den finns
    const vpWrapper = document.getElementById('vp-table-wrapper');
    if (vpWrapper) {
        vpWrapper.remove();
    }

    // Ta bort rubrikerna och hela tabellwrappern så att de kan skapas på nytt vid behov
    const chainsTitle = document.getElementById('chains-title');
    if (chainsTitle) {
        chainsTitle.remove();
    }

    const saljaproTitle = document.getElementById('saljapro-title');
    if (saljaproTitle) {
        saljaproTitle.remove();
    }

    const tableWrapper = document.getElementById('chain-table-wrapper');
    if (tableWrapper) {
        tableWrapper.remove();
    }
}