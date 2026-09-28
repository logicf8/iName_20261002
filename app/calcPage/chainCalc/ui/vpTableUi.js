/*app\calcPage\chainCalc\ui\vpTableUi.js*/
import { calculateLopmeter, calculateKvadrat } from '../utils/chainTableUtils.js';
import { PRESET_HEIGHTS_VP, DEFAULT_HEIGHT_VP, formatVpCopyText } from '../utils/vpTableUtils.js';

let vpRowCounter = 0;

// Håll reda på om höjderna är länkade samt det senaste valda höjdvärdet
let isVpHeightLinked = true;
let currentSyncedVpHeight = DEFAULT_HEIGHT_VP;

export function getOrCreateVpTable() {
    let vpTableWrapper = document.getElementById('vp-table-wrapper');
    const chainTableWrapper = document.getElementById('chain-table-wrapper');

    if (!vpTableWrapper && chainTableWrapper) {
        vpTableWrapper = document.createElement('div');
        vpTableWrapper.id = 'vp-table-wrapper';
        vpTableWrapper.className = 'chain-table-wrapper vp-table-wrapper';
        vpTableWrapper.style.marginTop = '20px';

        vpTableWrapper.innerHTML = `
            <table class="chain-table" id="vp-table">
                <thead>
                    <tr>
                        <th class="col-length">Längd</th>
                        <th class="col-height">
                            <div class="vp-sync-header">
                                <span>Höjd</span>
                                <label class="vp-sync-label" title="Länka alla VP-höjder">
                                    <input type="checkbox" id="vp-height-sync-toggle" class="vp-sync-checkbox" ${isVpHeightLinked ? 'checked' : ''}>
                                    <span>🔗</span>
                                </label>
                            </div>
                        </th>
                        <th class="col-kvadrat">m²</th>
                        <th class="col-lopmeter">Löpm.</th>
                        <th class="col-adjust">Justering</th>
                        <th class="col-actions">Åtgärder</th>
                    </tr>
                </thead>
                <tbody id="vp-table-body"></tbody>
            </table>
        `;

        chainTableWrapper.parentNode.insertBefore(vpTableWrapper, chainTableWrapper.nextSibling);

        const syncCheckbox = vpTableWrapper.querySelector('#vp-height-sync-toggle');
        if (syncCheckbox) {
            syncCheckbox.addEventListener('change', (e) => {
                isVpHeightLinked = e.target.checked;
                if (isVpHeightLinked) {
                    syncAllVpHeights(currentSyncedVpHeight);
                }
            });
        }
    }

    return vpTableWrapper;
}

function syncAllVpHeights(newHeight) {
    currentSyncedVpHeight = newHeight;
    const tbody = document.getElementById('vp-table-body');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const input = row.querySelector('.combobox-input');
        if (input) {
            input.value = newHeight; // Sätt värdet på alla rader
        }
        if (row.recalculateVpRow) {
            row.recalculateVpRow(); // Kalkylera om ALLA rader
        }
    });
}

export function updateVpTableVisibility() {
    const vpTableWrapper = document.getElementById('vp-table-wrapper');
    const tbody = document.getElementById('vp-table-body');
    
    if (!vpTableWrapper) return;

    if (tbody && tbody.children.length > 0) {
        vpTableWrapper.style.display = 'block';
    } else {
        vpTableWrapper.remove();
    }
}

export function addVpRow(baseLengthMm) {
    getOrCreateVpTable();
    const tbody = document.getElementById('vp-table-body');
    if (!tbody) return;

    vpRowCounter++;
    const rowId = `vp-row-${vpRowCounter}`;
    const radioGroupName = `vp-adjust-${rowId}`;

    const initialHeight = isVpHeightLinked ? currentSyncedVpHeight : DEFAULT_HEIGHT_VP;

    const tr = document.createElement('tr');
    tr.id = rowId;
    // Spara Ursprungsvärdet i elementets dataset
    tr.dataset.baseLength = baseLengthMm;

    // Bygg dropdown-listans HTML från PRESET_HEIGHTS_VP
    const dropdownItemsHtml = PRESET_HEIGHTS_VP
        .map(h => `<div class="combobox-item" data-value="${h}">${h}</div>`)
        .join('');

    tr.innerHTML = `
        <td class="col-length">
            <input type="text" class="vp-length-input" value="${baseLengthMm}" maxlength="6" style="width: 70px; text-align: center;">
        </td>
        <td class="col-height">
            <div class="combobox-container">
                <input type="text" class="combobox-input" value="${initialHeight}" maxlength="5">
                <button type="button" class="combobox-arrow" tabindex="-1">▾</button>
                <div class="combobox-dropdown">
                    ${dropdownItemsHtml}
                </div>
            </div>
        </td>
        <td class="col-kvadrat">${calculateKvadrat(baseLengthMm, initialHeight)}</td>
        <td class="col-lopmeter">${calculateLopmeter(baseLengthMm)}</td>
        <td class="col-adjust vp-radio-group">
            <label style="margin-right: 8px; cursor: pointer;">
                <input type="radio" name="${radioGroupName}" value="0" checked> 0
            </label>
            <label style="margin-right: 8px; cursor: pointer;">
                <input type="radio" name="${radioGroupName}" value="-2"> -2
            </label>
            <label style="cursor: pointer;">
                <input type="radio" name="${radioGroupName}" value="-4"> -4
            </label>
        </td>
        <td class="col-actions">
            <div class="chain-buttons-group">
                <button type="button" class="chain-row-btn delete-btn-style btn-delete-vp">Radera</button>
                <button type="button" class="chain-row-btn btn-copy-vp">Kopiera</button>
            </div>
        </td>
    `;

    // Koppla combobox-, justerings- och beräkningslogik
    setupVpRowEvents(tr);

    tbody.appendChild(tr);
    updateVpTableVisibility();
}

function setupVpRowEvents(row) {
    const container = row.querySelector('.combobox-container');
    const input = row.querySelector('.combobox-input');
    const arrow = row.querySelector('.combobox-arrow');
    const dropdown = row.querySelector('.combobox-dropdown');
    
    const lengthInput = row.querySelector('.vp-length-input');
    const kvadratCell = row.querySelector('.col-kvadrat');
    const lopmeterCell = row.querySelector('.col-lopmeter');
    const radios = row.querySelectorAll(`input[type="radio"]`);
    
    const btnDelete = row.querySelector('.btn-delete-vp');
    const btnCopy = row.querySelector('.btn-copy-vp');

    function getCurrentLength() {
        let val = parseInt(lengthInput.value, 10);
        return isNaN(val) ? 0 : val;
    }

    function getBaseLength() {
        let val = parseInt(row.dataset.baseLength, 10);
        return isNaN(val) ? 0 : val;
    }

    function getCurrentHeight() {
        let val = parseInt(input.value, 10);
        return isNaN(val) ? 0 : val;
    }

    function recalculate() {
        const currentLength = getCurrentLength();
        const currentHeight = getCurrentHeight();

        lopmeterCell.textContent = calculateLopmeter(currentLength);

        if (currentHeight <= 0 || currentLength <= 0) {
            kvadratCell.textContent = "0,00 m²";
            return;
        }

        kvadratCell.textContent = calculateKvadrat(currentLength, currentHeight);
    }

    row.recalculateVpRow = recalculate;

    function handleHeightChange(newVal) {
        if (isVpHeightLinked) {
            syncAllVpHeights(newVal);
        } else {
            recalculate();
        }
    }

    // --- Input-validering och manuell ändring av Längd ---
    lengthInput.addEventListener('input', () => {
        lengthInput.value = lengthInput.value.replace(/[^0-9]/g, '');
        
        // När användaren ändrar manuellt blir detta det nya ursprungsvärdet
        const newManualVal = getCurrentLength();
        row.dataset.baseLength = newManualVal;

        // Återställ radiobuttons till 0
        const zeroRadio = row.querySelector(`input[type="radio"][value="0"]`);
        if (zeroRadio) zeroRadio.checked = true;

        recalculate();
    });

    // --- Combobox Dropdown-logik ---
    function positionDropdown() {
        const rect = container.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;
    }

    function toggleDropdown(show) {
        const willOpen = show !== undefined ? show : !container.classList.contains('open');

        document.querySelectorAll('.combobox-container.open').forEach(c => {
            if (c !== container) c.classList.remove('open');
        });

        if (willOpen) {
            positionDropdown();
            container.classList.add('open');
        } else {
            container.classList.remove('open');
        }
    }

    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.combobox-item');
        if (item) {
            input.value = item.dataset.value;
            toggleDropdown(false);
            handleHeightChange(getCurrentHeight());
        }
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && !dropdown.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    window.addEventListener('scroll', () => toggleDropdown(false), true);
    window.addEventListener('resize', () => toggleDropdown(false));

    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
        handleHeightChange(getCurrentHeight());
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Escape') {
            toggleDropdown(false);
        }
    });

    // --- Radiobutton events ---
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const adjustValue = parseInt(radio.value, 10);
            const baseLength = getBaseLength();
            
            // Beräkna ny längd baserat på ursprungsvärdet
            const adjustedLength = Math.max(0, baseLength + adjustValue);
            lengthInput.value = adjustedLength;

            recalculate();
        });
    });

    // --- Radera-knapp ---
    btnDelete.addEventListener('click', () => {
        row.remove();
        updateVpTableVisibility();
    });

    // --- Kopiera-knapp ---
    btnCopy.addEventListener('click', () => {
        const length = getCurrentLength();
        const height = getCurrentHeight();

        const textToCopy = formatVpCopyText(length, height);

        navigator.clipboard.writeText(textToCopy).then(() => {
            const origText = btnCopy.textContent;
            btnCopy.textContent = 'Kopierat!';
            setTimeout(() => { btnCopy.textContent = origText; }, 1500);
        });
    });
}