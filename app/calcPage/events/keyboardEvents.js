//app\calcPage\events\keyboardEvents.js
import { currentView } from '../../pageControl/state/appState.js';
import { focusAndSetCursor, focusAndSetCursorToEnd } from '../chainCalc/ui/chainUI.js';

export function attachKeyboardEvents(elements, callbacks) {
    const { inputField, zeroToggle, depthToggle, cosToggle, btnAddChain } = elements;
    const { addMeasurementChain, handleInputLogic } = callbacks;

    if (!inputField) return;

    inputField.addEventListener('keydown', (e) => {
        // Kontrollera att calc-vyn faktiskt är aktiv
        if (currentView !== 'calc') return;

        // Enter -> Trigga klick på "Lägg till måttkedja"-knappen
        if (e.key === 'Enter') {
            e.preventDefault(); 
            if (btnAddChain) {
                btnAddChain.click();
            } else {
                addMeasurementChain();
            }
            return;
        }

        // 't' eller 'T' -> Toggle för zeroToggle
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
            if (zeroToggle) {
                e.preventDefault(); 
                zeroToggle.checked = !zeroToggle.checked; 
                zeroToggle.dispatchEvent(new Event('change', { bubbles: true }));
                focusAndSetCursorToEnd(inputField);
                return;
            }
        }

        // 'a' eller 'A' -> Toggle för depthToggle
        if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
            if (depthToggle) {
                e.preventDefault(); 
                depthToggle.checked = !depthToggle.checked; 
                depthToggle.dispatchEvent(new Event('change', { bubbles: true }));
                focusAndSetCursorToEnd(inputField);
                return;
            }
        }

        // 'c' eller 'C' -> Toggle för cosToggle
        const activeCosToggle = cosToggle || elements.cosToggle;
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
            if (activeCosToggle) {
                e.preventDefault(); 
                activeCosToggle.checked = !activeCosToggle.checked;
                activeCosToggle.dispatchEvent(new Event('change', { bubbles: true }));
                focusAndSetCursorToEnd(inputField);
                return;
            }
        }

        // Om zeroToggle är ikryssad och en siffra skrivs in -> lägg till '00'
        if (zeroToggle && zeroToggle.checked && /^[0-9]$/.test(e.key)) {
            e.preventDefault(); 

            let start = inputField.selectionStart;
            let end = inputField.selectionEnd;
            let currentValue = inputField.value;

            let insertedText = e.key + "00";
            let newValue = currentValue.substring(0, start) + insertedText + currentValue.substring(end);

            inputField.value = newValue;

            let newCursorPos = start + insertedText.length;
            focusAndSetCursor(inputField, newCursorPos);

            handleInputLogic();
        }
    });
}