//app\calcPage\chainCalc\events\chainEvents.js
import { attachInputEvents } from './chainInputEvents.js';
import { attachActionEvents } from './chainActionEvents.js';
import { attachKeyboardEvents } from '../../events/keyboardEvents.js';

export function attachChainEvents(elements) {
    const { handleInputLogic, targetHsToggle } = attachInputEvents(elements);
    const { addMeasurementChain } = attachActionEvents(elements, { handleInputLogic, targetHsToggle });

    // Tillåt endast siffror i Hällskarv-inputen
    const hsInput = document.getElementById('hs-value-input');
    if (hsInput) {
        hsInput.addEventListener('input', () => {
            hsInput.value = hsInput.value.replace(/[^0-9]/g, '');
        });
    }

    attachKeyboardEvents(elements, { addMeasurementChain, handleInputLogic });

    handleInputLogic();
}