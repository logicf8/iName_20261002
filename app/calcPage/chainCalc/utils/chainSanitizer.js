//app\calcPage\chainCalc\utils\chainSanitizer.js
export function cleanAndSanitizeInput(value) {
    let originalLength = value.length;

    // Tillåt siffror, +, -, d, h, s
    value = value.replace(/[^0-9+-dhs]/g, '');

    // Rätta till dubbletter av bokstäver
    value = value.replace(/d[dh]/g, 'h').replace(/h[hd]/g, 'd');

    // Validera att bokstavsprefix (hs, d, h, s) bara står först eller direkt efter + / -
    let validChars = [];
    for (let i = 0; i < value.length; i++) {
        let char = value[i];
        if (char === 'd' || char === 'h' || char === 's') {
            let isHs = (char === 'h' && i + 1 < value.length && value[i + 1] === 's') ||
                       (char === 's' && i > 0 && value[i - 1] === 'h');
            let prevChar = isHs && char === 's' ? (i > 1 ? value[i - 2] : null) : (i > 0 ? value[i - 1] : null);
            let isStartOrSign = (i === 0) || (char === 's' && isHs && i === 1) || prevChar === '+' || prevChar === '-';

            if (isStartOrSign) {
                validChars.push(char);
            }
        } else {
            validChars.push(char);
        }
    }
    value = validChars.join('');

    value = value.replace(/([dhs]|hs)[+-]/g, '$1');
    value = value.replace(/[+-]{2,}/g, (match) => match[0]);

    return {
        cleanedValue: value,
        lengthDifference: originalLength - value.length
    };
}