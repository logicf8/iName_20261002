// app/calcPage/chainCalc/utils/vpTableUtils.js

export const PRESET_HEIGHTS_VP = [100, 151, 200, 300, 532, 542, 555, 565, 575];
export const DEFAULT_HEIGHT_VP = 565;

/**
 * Genererar textsträngen för clipboard baserat på höjden.
 * Höjd < 151  => "Bakkantslist: Längd x Höjd mm"
 * Höjd >= 151 => "Väggplatta: Längd x Höjd mm"
 */
export function formatVpCopyText(lengthMm, heightMm) {
    const label = heightMm < 151 ? 'Bakkantslist' : 'Väggplatta';
    return `${label}: ${lengthMm} x ${heightMm} mm`;
}