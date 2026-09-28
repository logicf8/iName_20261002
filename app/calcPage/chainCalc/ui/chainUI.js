/*app\calcPage\chainCalc\ui\chainUI.js */
import { parseChainData, mirrorChainString } from '../utils/chainParser.js';
import { calculateCCSegmentData } from '../utils/ccCalculations.js';
import { calculateLopmeter, calculateKvadrat } from '../utils/chainTableUtils.js';
import { PRESET_HEIGHTS_VP, DEFAULT_HEIGHT_VP, formatVpCopyText } from '../utils/vpTableUtils.js';

let vpRowCounter = 0;

// Håll reda på om höjderna är länkade samt det senaste valda höjdvärdet
let isVpHeightLinked = true;
let currentSyncedVpHeight = DEFAULT_HEIGHT_VP;

export function focusAndSetCursor(inputField, position) {
    inputField.focus();
    inputField.setSelectionRange(position, position);
}

export function focusAndSetCursorToEnd(inputField) {
    focusAndSetCursor(inputField, inputField.value.length);
}

export function updateSummaryUI(summaryField, totalSum) {
    summaryField.textContent = `Summa = ${totalSum} mm`;
}

/**
 * Hjälpfunktion för att invertera/spegla tillståndets sidoval vid "Omvänt"
 */
export function getMirroredState(state) {
    if (!state) return state;

    const mirrored = { ...state };

    // 1. Spegla djupavdrag (depth-toggle)
    if (state.isDepthActive) {
        if (state.side === 'left') {
            mirrored.side = 'right';
            mirrored.depthRightVal = state.depthLeftVal;
            mirrored.depthLeftVal = 0;
        } else if (state.side === 'right') {
            mirrored.side = 'left';
            mirrored.depthLeftVal = state.depthRightVal;
            mirrored.depthRightVal = 0;
        } else if (state.side === 'both') {
            mirrored.side = 'both';
            mirrored.depthLeftVal = state.depthRightVal;
            mirrored.depthRightVal = state.depthLeftVal;
        }
    }

    // 2. Spegla cosToggle
    if (state.isCosActive || state.cosSide) {
        if (state.cosSide === 'left') {
            mirrored.cosSide = 'right';
        } else if (state.cosSide === 'right') {
            mirrored.cosSide = 'left';
        }
    }

    // 3. Spegla hallskarvToggle (hsSide)
    if (state.hsSide === 'left') {
        mirrored.hsSide = 'right';
    } else if (state.hsSide === 'right') {
        mirrored.hsSide = 'left';
    }

    return mirrored;
}

export function createChainBlockUI(originalText, state, callbacks) {
    const { parseChainDataResult, onEdit, onDelete, onReverse } = callbacks;

    let chainBlock = document.createElement('div');
    chainBlock.className = 'chain-block';

    let mainRow = document.createElement('div');
    mainRow.className = 'chain-row';

    let mainLabel = document.createElement('span');
    mainLabel.className = 'chain-text-label';
    mainLabel.textContent = parseChainDataResult.mainLabelText;
    mainRow.appendChild(mainLabel);

    let btnGroup = document.createElement('div');
    btnGroup.className = 'chain-buttons-group';

    // Beräkna den omvända måttkedjan och dess tillstånd
    let isReversed = false;
    const reversedText = mirrorChainString(originalText);
    const reversedState = getMirroredState(state);
    const reversedChainData = parseChainData(reversedText);

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'chain-row-btn delete-btn-style';
    deleteBtn.textContent = 'Radera';
    deleteBtn.addEventListener('click', () => {
        chainBlock.remove();
        if (onDelete) onDelete();
    });

    let editBtn = document.createElement('button');
    editBtn.className = 'chain-row-btn';
    editBtn.textContent = 'Editera';
    editBtn.addEventListener('click', () => {
        chainBlock.remove();
        if (onEdit) onEdit(originalText, state);
    });

    let reverseChainBtn = document.createElement('button');
    reverseChainBtn.className = 'chain-row-btn';
    reverseChainBtn.textContent = 'Omvänt';
    reverseChainBtn.addEventListener('click', () => {
        isReversed = !isReversed;
        
        // Uppdatera huvudetiketten
        mainLabel.textContent = isReversed 
            ? reversedChainData.mainLabelText 
            : parseChainDataResult.mainLabelText;

        // Rendera om CC-segment och re-trigga omberäkningar i tabellen
        const activeText = isReversed ? reversedText : originalText;
        const activeState = isReversed ? reversedState : state;
        
        renderCCRows(activeText, activeState);

        if (onReverse) {
            onReverse(activeText, activeState, isReversed);
        }
    });

    let copyBtn = document.createElement('button');
    copyBtn.className = 'chain-row-btn';
    copyBtn.textContent = 'Kopiera';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(mainLabel.textContent).then(() => {
            let origText = copyBtn.textContent;
            copyBtn.textContent = 'Kopierad!';
            setTimeout(() => { copyBtn.textContent = origText; }, 1000);
        });
    });

    btnGroup.appendChild(deleteBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(reverseChainBtn);
    btnGroup.appendChild(copyBtn);
    mainRow.appendChild(btnGroup);
    chainBlock.appendChild(mainRow);

    // Behållare för dynamiska CC-rader
    let ccContainer = document.createElement('div');
    ccContainer.className = 'cc-container';
    chainBlock.appendChild(ccContainer);

    function renderCCRows(currentText, currentState) {
        ccContainer.innerHTML = '';
        
        const { 
            isDepthActive, 
            side, 
            depthLeftVal, 
            depthRightVal,
            isCosActive,
            cosValue,
            cosDrain,
            hsValue,
            hsSide
        } = currentState;

        let rawSegments = currentText.match(/([+-]?(?:hs|[dhs])?[0-9]+)/g) || [];

        rawSegments.forEach((segment) => {
            let ccData = calculateCCSegmentData(
                segment, 
                rawSegments, 
                isDepthActive, 
                side, 
                depthLeftVal, 
                depthRightVal,
                isCosActive,
                cosValue,
                cosDrain,
                hsValue,
                hsSide
            );

            if (ccData) {
                let showHighest = false;

                // RAD 1: CC DISKHO / HÄLL
                let ccRow = document.createElement('div');
                ccRow.className = 'chain-row cc-row';

                let ccLabel = document.createElement('span');
                ccLabel.className = 'chain-text-label';
                ccRow.appendChild(ccLabel);

                let ccBtnGroup = document.createElement('div');
                ccBtnGroup.className = 'chain-buttons-group';

                let reverseBtn = document.createElement('button');
                reverseBtn.className = 'chain-row-btn reverse-btn-style';
                reverseBtn.textContent = 'Byt håll';

                let ccCopyBtn = document.createElement('button');
                ccCopyBtn.className = 'chain-row-btn';
                ccCopyBtn.textContent = 'Kopiera';

                ccBtnGroup.appendChild(reverseBtn);
                ccBtnGroup.appendChild(ccCopyBtn);
                ccRow.appendChild(ccBtnGroup);
                ccContainer.appendChild(ccRow);

                // RAD 2: CC DISKHO- PLÅT
                let plateRow = document.createElement('div');
                plateRow.className = 'chain-row cc-row cc-plate-row';

                let plateLabel = document.createElement('span');
                plateLabel.className = 'chain-text-label';
                plateRow.appendChild(plateLabel);

                let plateBtnGroup = document.createElement('div');
                plateBtnGroup.className = 'chain-buttons-group';

                let plateCopyBtn = document.createElement('button');
                plateCopyBtn.className = 'chain-row-btn';
                plateCopyBtn.textContent = 'Kopiera';

                plateBtnGroup.appendChild(plateCopyBtn);
                plateRow.appendChild(plateBtnGroup);
                ccContainer.appendChild(plateRow);

                function updateCCView() {
                    if (showHighest) {
                        ccLabel.textContent = `${ccData.labelType}: ${ccData.maxText} = ${ccData.maxSum} mm`;
                    } else {
                        ccLabel.textContent = `${ccData.labelType}: ${ccData.minText} = ${ccData.minSum} mm`;
                    }

                    if (ccData.isCosActive) {
                        let plateText = showHighest ? ccData.maxPlateText : ccData.minPlateText;
                        let plateSum = showHighest ? ccData.maxPlateSum : ccData.minPlateSum;
                        plateLabel.textContent = `CC Diskho- plåt: ${plateText} = ${plateSum} mm`;
                        plateRow.style.display = 'flex';
                    } else {
                        plateRow.style.display = 'none';
                    }
                }

                reverseBtn.addEventListener('click', () => {
                    showHighest = !showHighest;
                    updateCCView();
                });

                ccCopyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(ccLabel.textContent).then(() => {
                        let origText = ccCopyBtn.textContent;
                        ccCopyBtn.textContent = 'Kopierad!';
                        setTimeout(() => { ccCopyBtn.textContent = origText; }, 1000);
                    });
                });

                plateCopyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(plateLabel.textContent).then(() => {
                        let origText = plateCopyBtn.textContent;
                        plateCopyBtn.textContent = 'Kopierad!';
                        setTimeout(() => { plateCopyBtn.textContent = origText; }, 1000);
                    });
                });

                updateCCView();
            }
        });
    }

    // Initial rendering av CC-rader
    renderCCRows(originalText, state);

    return chainBlock;
}

/* ==========================================================================
   VP (Väggplatta) UI Logik
   ========================================================================== */

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
                        <th class="col-actions">Åtgärd</th>
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
        if (input && input.value !== String(newHeight)) {
            input.value = newHeight;
            if (row.recalculateVpRow) {
                row.recalculateVpRow();
            }
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

    function getCurrentBaseLength() {
        let val = parseInt(lengthInput.value, 10);
        return isNaN(val) ? 0 : val;
    }

    function getCurrentAdjustment() {
        const checked = row.querySelector(`input[type="radio"]:checked`);
        return checked ? parseInt(checked.value, 10) : 0;
    }

    function getCurrentHeight() {
        let val = parseInt(input.value, 10);
        return isNaN(val) ? 0 : val;
    }

    function recalculate() {
        const baseLength = getCurrentBaseLength();
        const adjustment = getCurrentAdjustment();
        const activeLength = Math.max(0, baseLength + adjustment);
        const currentHeight = getCurrentHeight();

        lopmeterCell.textContent = calculateLopmeter(activeLength);

        if (currentHeight <= 0 || activeLength <= 0) {
            kvadratCell.textContent = "0,00 m²";
            return;
        }

        kvadratCell.textContent = calculateKvadrat(activeLength, currentHeight);
    }

    row.recalculateVpRow = recalculate;

    function handleHeightChange(newVal) {
        if (isVpHeightLinked) {
            syncAllVpHeights(newVal);
        } else {
            recalculate();
        }
    }

    lengthInput.addEventListener('input', () => {
        lengthInput.value = lengthInput.value.replace(/[^0-9]/g, '');
        recalculate();
    });

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

    radios.forEach(radio => {
        radio.addEventListener('change', recalculate);
    });

    btnDelete.addEventListener('click', () => {
        row.remove();
        updateVpTableVisibility();
    });

    btnCopy.addEventListener('click', () => {
        const baseLength = getCurrentBaseLength();
        const adjustment = getCurrentAdjustment();
        const activeLength = Math.max(0, baseLength + adjustment);
        const height = getCurrentHeight();

        const textToCopy = formatVpCopyText(activeLength, height);

        navigator.clipboard.writeText(textToCopy).then(() => {
            const origText = btnCopy.textContent;
            btnCopy.textContent = 'Kopierat!';
            setTimeout(() => { btnCopy.textContent = origText; }, 1500);
        });
    });
}