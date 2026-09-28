//app\calcPage\chainCalc\events\chainActionEvents.js
import { parseChainData, parseChainGroups } from '../utils/chainParser.js';
import { getChainState, resetChainStateToDefault } from '../state/chainState.js';
import { focusAndSetCursorToEnd, createChainBlockUI, addVpRow } from '../ui/chainUI.js';
import { addTableRow, removeTableRow, clearTable } from '../ui/chainTableUi.js';
import { resetToggle } from './chainInputEvents.js';

export function attachActionEvents(elements, { handleInputLogic, targetHsToggle }) {
    const {
        inputField,
        zeroToggle,
        depthToggle,
        cosToggle,
        btnClear,
        btnReloadCalc,
        btnAddChain,
        chainsContainer
    } = elements;

function addMeasurementChain() {
    if (!inputField) return;
    let originalText = inputField.value.trim();
    if (!originalText) return;

    let state = getChainState();
    let parseChainDataResult = parseChainData(originalText);
    let groupLengths = parseChainGroups(originalText, state);
    let chainId = 'chain-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);

    let chainBlock = createChainBlockUI(originalText, state, {
        parseChainDataResult,
        onDelete: () => {
            removeTableRow(chainId);
            focusAndSetCursorToEnd(inputField);
        },
        onEdit: (textToRestore, savedState) => {
            removeTableRow(chainId);
            inputField.value = textToRestore;
            handleInputLogic();
            focusAndSetCursorToEnd(inputField);
        },
        onReverse: (activeText, activeState, isReversed) => {
            removeTableRow(chainId);
            let newGroupLengths = parseChainGroups(activeText, activeState);
            
            // Hämta dSplit för den omvända texten
            let reversedParsed = parseChainData(activeText);
            let reversedDSplit = reversedParsed ? reversedParsed.dSplit : null;

            addTableRow(chainId, newGroupLengths, activeState, reversedDSplit);
        },
     });

    chainBlock.dataset.chainId = chainId;
        if (chainsContainer) chainsContainer.appendChild(chainBlock);

        // Hämta dSplit från analysen av originaltexten
        let dSplit = parseChainDataResult ? parseChainDataResult.dSplit : null;
        
        // Skicka med dSplit till tabellen
        addTableRow(chainId, groupLengths, state, dSplit);

        inputField.value = "";
        handleInputLogic();
        focusAndSetCursorToEnd(inputField);
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            resetChainStateToDefault();
            handleInputLogic();
            if (inputField) focusAndSetCursorToEnd(inputField);
        });
    }

    if (btnReloadCalc) {
        btnReloadCalc.addEventListener('click', () => {
            resetChainStateToDefault();
            if (chainsContainer) chainsContainer.innerHTML = "";
            clearTable();
            handleInputLogic();
            if (inputField) focusAndSetCursorToEnd(inputField);
        });
    }

    if (btnAddChain) {
        btnAddChain.addEventListener('click', () => {
            if (!inputField || !inputField.value.trim()) return;

            addMeasurementChain();

            resetToggle(zeroToggle);
            resetToggle(depthToggle);
            const activeCosToggle = cosToggle || elements.cosToggle;
            if (activeCosToggle) {
                resetToggle(activeCosToggle);
            }
            if (targetHsToggle) {
                resetToggle(targetHsToggle);
            }
        });
    }

    return { addMeasurementChain };
}