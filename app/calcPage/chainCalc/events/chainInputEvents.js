import { cleanAndSanitizeInput } from '../utils/chainSanitizer.js';
import { calculateInputSum, mirrorChainString } from '../utils/chainParser.js';
import { focusAndSetCursor, focusAndSetCursorToEnd, updateSummaryUI } from '../ui/chainUI.js';

export function setToggleState(toggleElement, shouldBeChecked) {
    if (toggleElement && toggleElement.checked !== shouldBeChecked) {
        toggleElement.checked = shouldBeChecked;
        toggleElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

export function resetToggle(toggleElement) {
    if (toggleElement && toggleElement.checked) {
        toggleElement.checked = false;
        toggleElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

export function attachInputEvents(elements) {
    const {
        inputField,
        summaryField,
        zeroToggle,
        depthToggle,
        cosToggle,
        hallskarvToggle,
        depthLeftInput,
        depthRightInput,
        mirrorBtn,
        btnDiskho,
        btnHall,
        btnSkarv,
        btnHallskarv
    } = elements;

    const targetHsToggle = hallskarvToggle || elements.hallskarvToggle;

    function handleInputLogic() {
        if (!inputField) return;
        const hasHs = inputField.value.toLowerCase().includes('hs');
        setToggleState(targetHsToggle, hasHs);

        let selectionStart = inputField.selectionStart;
        let selectionEnd = inputField.selectionEnd;

        let { cleanedValue, lengthDifference } = cleanAndSanitizeInput(inputField.value);
        inputField.value = cleanedValue;

        if (selectionStart !== null && selectionEnd !== null) {
            inputField.setSelectionRange(selectionStart - lengthDifference, selectionEnd - lengthDifference);
        }

        let total = calculateInputSum(cleanedValue);
        updateSummaryUI(summaryField, total);
    }

    function insertCharacterAtCursor(char) {
        if (!inputField) return;
        let start = inputField.selectionStart ?? inputField.value.length;
        let end = inputField.selectionEnd ?? inputField.value.length;
        let currentValue = inputField.value;

        let newValue = currentValue.substring(0, start) + char + currentValue.substring(end);
        inputField.value = newValue;

        handleInputLogic();

        let insertedLength = inputField.value.length - currentValue.length;
        let newCursorPos = insertedLength > 0 ? start + char.length : start;

        focusAndSetCursor(inputField, newCursorPos);
    }

    if (depthLeftInput) {
        depthLeftInput.addEventListener('input', () => {
            depthLeftInput.value = depthLeftInput.value.replace(/[^0-9]/g, '');
        });
    }

    if (depthRightInput) {
        depthRightInput.addEventListener('input', () => {
            depthRightInput.value = depthRightInput.value.replace(/[^0-9]/g, '');
        });
    }

    if (btnDiskho) btnDiskho.addEventListener('click', () => insertCharacterAtCursor('d'));
    if (btnHall) btnHall.addEventListener('click', () => insertCharacterAtCursor('h'));
    if (btnSkarv) btnSkarv.addEventListener('click', () => insertCharacterAtCursor('s'));
    if (btnHallskarv) btnHallskarv.addEventListener('click', () => insertCharacterAtCursor('hs'));

    if (mirrorBtn) {
        mirrorBtn.addEventListener('click', () => {
            if (!inputField) return;
            let currentValue = inputField.value;
            if (currentValue.length > 0) {
                let mirroredString = mirrorChainString(currentValue);
                inputField.value = mirroredString;
                handleInputLogic();
            }
            focusAndSetCursorToEnd(inputField);
        });
    }

    if (depthToggle) {
        depthToggle.addEventListener('change', () => {
            if (inputField) focusAndSetCursorToEnd(inputField);
        });
    }

    if (zeroToggle) {
        zeroToggle.addEventListener('change', () => {
            if (inputField) focusAndSetCursorToEnd(inputField);
        });
    }

    let targetCosToggle = cosToggle || elements.cosToggle;
    if (targetCosToggle) {
        targetCosToggle.addEventListener('change', () => {
            if (inputField) focusAndSetCursorToEnd(inputField);
        });
    }

    if (targetHsToggle) {
        targetHsToggle.addEventListener('change', () => {
            if (inputField) focusAndSetCursorToEnd(inputField);
        });
    }

    if (inputField) {
        inputField.addEventListener('input', () => {
            handleInputLogic();
        });
    }

    return { handleInputLogic, targetHsToggle };
}