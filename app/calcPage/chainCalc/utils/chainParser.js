//app\calcPage\chainCalc\utils\chainParser.js
import { formatArea } from './chainFormatting.js';
import { getBackwallDSplitLengths } from './ccCalculations.js';

export function calculateInputSum(text) {
    if (!text) return 0;

    let cleanText = text.replace(/(hs|[dhs])/g, '');
    let parts = cleanText.match(/([+-]?[0-9]+)/g) || [];
    let total = 0;

    parts.forEach(part => {
        let num = parseInt(part, 10);
        if (!isNaN(num)) {
            total += num;
        }
    });

    return total;
}

export function parseChainData(originalText) {
    let cleanTextForCalc = originalText.replace(/(hs|[dhs])/g, '');
    let matches = cleanTextForCalc.match(/([+-]?[0-9]+)/g) || [];
    let totalSum = 0;
    let formattedParts = [];

    matches.forEach((part, index) => {
        let num = parseInt(part, 10);
        if (!isNaN(num)) {
            totalSum += num;
            if (index === 0) {
                formattedParts.push(part);
            } else {
                if (part.startsWith('-')) {
                    formattedParts.push('- ' + part.substring(1));
                } else if (part.startsWith('+')) {
                    formattedParts.push('+ ' + part.substring(1));
                } else {
                    formattedParts.push('+ ' + part);
                }
            }
        }
    });

    let readableChainText = formattedParts.join(' ');
    let mainLabelText = `Måttkedja: ${readableChainText} = ${totalSum} mm`;
    let areaText = formatArea(totalSum);

    let rawSegments = originalText.match(/([+-]?(?:hs|[dhs])?[0-9]+)/g) || [];
    let dSplit = getBackwallDSplitLengths(rawSegments);

    return {
        totalSum,
        readableChainText,
        mainLabelText,
        areaText,
        dSplit
    };
}

/**
 * Delar upp måttkedjan i grupper (bänkskivor) baserat på 's' och 'hs'.
 */
export function parseChainGroups(originalText, state) {
    let segments = originalText.match(/([+-]?(?:hs|[dhs])?[0-9]+)/g) || [];
    if (segments.length === 0) return [0];

    let groupLengths = [];
    let currentGroupSum = 0;
    let hasActiveGroup = false;

    let hsHallMatt = (state && state.hsValue) ? state.hsValue : 560;
    let hsSide = (state && state.hsSide) ? state.hsSide : 'left';

    segments.forEach((seg) => {
        let match = seg.match(/^([+-]?)(hs|[dhs])?([0-9]+)$/);
        if (!match) return;

        let sign = match[1] === '-' ? -1 : 1;
        let prefix = match[2] || '';
        let num = parseInt(match[3], 10) * sign;

        if (prefix === 's') {
            if (hasActiveGroup) {
                groupLengths.push(currentGroupSum);
            }
            currentGroupSum = num;
            hasActiveGroup = true;
        } else if (prefix === 'hs') {
            let fullHsVal = Math.abs(num);
            let offset = Math.round((fullHsVal - hsHallMatt) / 2);

            let leftPart = 0;
            let rightPart = 0;

            if (hsSide === 'left') {
                leftPart = offset * sign;
                rightPart = (fullHsVal - offset) * sign;
            } else {
                leftPart = (fullHsVal - offset) * sign;
                rightPart = offset * sign;
            }

            currentGroupSum += leftPart;
            groupLengths.push(currentGroupSum);

            currentGroupSum = rightPart;
            hasActiveGroup = true;
        } else {
            currentGroupSum += num;
            hasActiveGroup = true;
        }
    });

    if (hasActiveGroup) {
        groupLengths.push(currentGroupSum);
    }

    return groupLengths;
}

/**
 * Speglar/vänder på en måttkedjestring.
 * - 's' (vanlig skarv): Flyttas till nästa segment i den omvända ordningen.
 * - 'hs', 'd', 'h': Stannar kvar på sitt specifika mått/nummer.
 */
export function mirrorChainString(currentValue) {
    if (!currentValue || currentValue.length === 0) return "";

    let segments = currentValue.match(/([+-]?(?:hs|[dhs])?[0-9]+)/g) || [];
    if (segments.length === 0) return currentValue;

    let parsed = segments.map((seg) => {
        let match = seg.match(/^([+-]?)(hs|[dhs])?([0-9]+)$/i);
        if (!match) return { raw: seg, sign: '', prefix: '', num: '' };
        return {
            raw: seg,
            sign: match[1] || '',
            prefix: (match[2] || '').toLowerCase(),
            num: match[3] || ''
        };
    });

    const N = parsed.length;
    let reversed = [...parsed].reverse();

    let mirroredString = "";

    reversed.forEach((seg, newIndex) => {
        let origIndex = N - 1 - newIndex;

        // Om nästa ursprungliga segment hade en vanlig skarv 's', ska den flyttas hit i den speglade ordningen
        let targetJoint = null;
        if (origIndex + 1 < N) {
            let nextOrigPrefix = parsed[origIndex + 1].prefix;
            if (nextOrigPrefix === 's') {
                targetJoint = 's';
            }
        }

        // Bestäm nytt prefix
        let newPrefix = '';
        if (targetJoint) {
            newPrefix = targetJoint;
        } else if (seg.prefix && seg.prefix !== 's') {
            // 'hs', 'd', 'h' behålls på sitt nummer (medan 's' har flyttats vidare)
            newPrefix = seg.prefix;
        }

        let hasMinus = seg.sign === '-';
        if (newIndex === 0) {
            mirroredString += (hasMinus ? '-' : '') + newPrefix + seg.num;
        } else {
            mirroredString += (hasMinus ? '-' : '+') + newPrefix + seg.num;
        }
    });

    return mirroredString;
}