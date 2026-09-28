//app\calcPage\chainCalc\utils\chainTableUtils.js
export const PRESET_DEPTHS = [635, 655, 822, 890, 940, 1046, 1250, 1270];
export const DEFAULT_DEPTH = 635;

export function calculateEffectiveLength(originalLengthMm, state) {
    if (!state || !state.isDepthActive) {
        return originalLengthMm;
    }

    let effectiveLength = originalLengthMm;

    if (state.side === 'left') {
        effectiveLength -= (state.depthLeftVal || 0);
    } else if (state.side === 'right') {
        effectiveLength -= (state.depthRightVal || 0);
    } else if (state.side === 'both') {
        effectiveLength -= ((state.depthLeftVal || 0) + (state.depthRightVal || 0));
    }

    return Math.max(0, effectiveLength);
}

export function calculateLopmeter(lengthMm) {
    if (!lengthMm || lengthMm <= 0) return "0,00 m";
    const meters = lengthMm / 1000;
    const rounded = Math.ceil(meters * 100) / 100;
    return rounded.toFixed(2).replace('.', ',') + " m";
}

export function calculateKvadrat(lengthMm, depthMm) {
    if (!lengthMm || !depthMm || lengthMm <= 0 || depthMm <= 0) return "0,00 m²";
    const lengthM = lengthMm / 1000;
    const depthM = depthMm / 1000;
    const sqm = lengthM * depthM;
    const rounded = Math.ceil(sqm * 100) / 100;
    return rounded.toFixed(2).replace('.', ',') + " m²";
}