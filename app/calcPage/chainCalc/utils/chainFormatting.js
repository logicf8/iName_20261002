//app\calcPage\chainCalc\utils\chainFormatting.js
/**
 * Avrundar ett millimeter-värde uppåt till närmaste hundradel (meter / m²).
 * Exempel: 2470 -> 2.47, 2471 -> 2.48
 */
export function roundUpMeters(mmValue) {
    if (!mmValue && mmValue !== 0) return 0;
    let num = typeof mmValue === 'string' ? parseFloat(mmValue) : mmValue;
    if (isNaN(num)) return 0;

    return Math.ceil(Math.abs(num) / 10) / 100;
}

/**
 * Formaterar millimeter till m² med uppåtavrundning om sista siffran är > 0.
 * Exempel: 2470 -> "2,47 m²", 2471 -> "2,48 m²"
 */
export function formatArea(mmValue) {
    let rounded = roundUpMeters(mmValue);
    return rounded.toFixed(2).replace('.', ',') + ' m²';
}