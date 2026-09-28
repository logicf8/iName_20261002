//app\calcPage\calculateChains.js
import { getChainElements } from './chainCalc/state/chainState.js';
import { attachChainEvents } from './chainCalc/events/chainEvents.js';

export function initCalculator() {
    const elements = getChainElements();

    if (!elements) return; // Guard clause om kalkylatorn inte finns i DOM:en

    attachChainEvents(elements);
}