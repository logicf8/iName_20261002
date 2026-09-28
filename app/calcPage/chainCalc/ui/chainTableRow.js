import { 
    PRESET_DEPTHS, 
    DEFAULT_DEPTH, 
    calculateLopmeter, 
    calculateKvadrat 
} from '../utils/chainTableUtils.js';

import { addVpRow } from './vpTableUi.js';

function handleCopyFeedback(button, originalText, textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        button.textContent = "Kopierat!";
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 1500);
    }).catch(err => {
        console.error('Kunde inte kopiera text: ', err);
    });
}

function setupRowEvents(row, lengthMm, dSplit) {
    const container = row.querySelector('.combobox-container');
    const input = row.querySelector('.combobox-input');
    const arrow = row.querySelector('.combobox-arrow');
    const dropdown = row.querySelector('.combobox-dropdown');
    const kvadratCell = row.querySelector('.col-kvadrat');
    const lopmeterCell = row.querySelector('.col-lopmeter');
    const btnCopy = row.querySelector('.btn-copy-single');
    const btnCreateVp = row.querySelector('.btn-create-vp');
    const btnCreateVpMixer = row.querySelector('.btn-create-vp-mixer');

    function getCurrentDepth() {
        let val = parseInt(input.value, 10);
        return isNaN(val) ? 0 : val;
    }

    function recalculate() {
        let currentDepth = getCurrentDepth();
        if (currentDepth <= 0) {
            kvadratCell.textContent = "0,00 m²";
            lopmeterCell.textContent = "0,00 m";
            return;
        }

        kvadratCell.textContent = calculateKvadrat(lengthMm, currentDepth);
        lopmeterCell.textContent = calculateLopmeter(lengthMm);
    }

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
            recalculate();
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
        recalculate();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Escape') {
            toggleDropdown(false);
        }
    });

    if (btnCreateVpMixer && dSplit && dSplit.hasD) {
        btnCreateVpMixer.addEventListener('click', () => {
            addVpRow(dSplit.startToHalfD);
            addVpRow(dSplit.halfDToEnd);
        });
    }

    if (btnCreateVp) {
        btnCreateVp.addEventListener('click', () => {
            addVpRow(lengthMm);
        });
    }

    btnCopy.addEventListener('click', () => {
        const depth = getCurrentDepth();
        const textToCopy = `Bänkskiva: ${lengthMm} x ${depth} mm`;

        handleCopyFeedback(btnCopy, 'Kopiera', textToCopy);
    });
}

export function createTableRowElement(chainId, effectiveLengthMm, dSplit = null) {
    const defaultDepth = DEFAULT_DEPTH;
    const row = document.createElement('tr');
    row.dataset.chainId = chainId;
    row.dataset.lengthMm = effectiveLengthMm;

    let dropdownItemsHtml = PRESET_DEPTHS.map(d => `<div class="combobox-item" data-value="${d}">${d}</div>`).join('');

    const vpMixerButtonHtml = (dSplit && dSplit.hasD) 
        ? `<button type="button" class="chain-row-btn btn-create-vp-mixer" title="Skapa VP blandare (2st uppdelade vid diskho)">VP blandare</button>` 
        : '';

    row.innerHTML = `
            <td class="col-length">${effectiveLengthMm} mm</td>
            <td class="col-depth">
                <div class="combobox-container">
                    <input type="text" class="combobox-input" value="${defaultDepth}" maxlength="5">
                    <button type="button" class="combobox-arrow" tabindex="-1">▾</button>
                    <div class="combobox-dropdown">
                        ${dropdownItemsHtml}
                    </div>
                </div>
            </td>
            <td class="col-kvadrat">${calculateKvadrat(effectiveLengthMm, defaultDepth)}</td>
            <td class="col-lopmeter">${calculateLopmeter(effectiveLengthMm)}</td>
            <td class="col-actions">
                <div class="chain-buttons-group">
                    ${vpMixerButtonHtml}
                    <button type="button" class="chain-row-btn btn-create-vp" title="Skapa Väggplatta/Bakkantslist">Skapa VP</button>
                    <button type="button" class="chain-row-btn btn-copy-single" title="Kopiera till urklipp">Kopiera</button>
                </div>
            </td>
        `;

    setupRowEvents(row, effectiveLengthMm, dSplit);
    return row;
}