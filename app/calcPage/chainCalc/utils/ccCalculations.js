//app\calcPage\chainCalc\utils\ccCalculations.js
/**
 * Kontrollerar om någon del i måttkedjan har prefixet 'd' (Diskho).
 *
 * @param {Array<string>} rawSegments - Måttkedjan, t.ex. ["500", "d800", "600"]
 * @returns {boolean}
 */
export function hasDSegmentInChain(rawSegments) {
    if (!Array.isArray(rawSegments)) return false;
    return rawSegments.some(seg => /^([+-]?)d[0-9]+$/.test(seg));
}

/**
 * Beräknar avstånd från start på hela måttkedjan till mitten av 'd'-måttet,
 * samt från mitten av 'd'-måttet till slutet av måttkedjan.
 * Tar INTE hänsyn till isDepthActive, skarvar (s/hs) eller grupper.
 *
 * @param {Array<string>} rawSegments - Hela måttkedjan, t.ex. ["500", "d800", "600"]
 * @returns {{ hasD: boolean, startToHalfD: number, halfDToEnd: number } | null}
 */
export function getBackwallDSplitLengths(rawSegments) {
    if (!Array.isArray(rawSegments)) return null;

    const dIndex = rawSegments.findIndex(seg => /^([+-]?)d[0-9]+$/.test(seg));

    if (dIndex === -1) {
        return {
            hasD: false,
            startToHalfD: 0,
            halfDToEnd: 0
        };
    }

    let startToHalfD = 0;
    let halfDToEnd = 0;

    rawSegments.forEach((seg, index) => {
        const match = seg.match(/^([+-]?)(hs|[dhs])?([0-9]+)$/);
        if (!match) return;

        const sign = match[1] === '-' ? -1 : 1;
        const value = parseInt(match[3], 10) * sign;

        if (index < dIndex) {
            // Före d-segmentet
            startToHalfD += value;
        } else if (index === dIndex) {
            // Vid d-segmentet (hälften läggs till på vardera sida)
            const halfValue = value / 2;
            startToHalfD += halfValue;
            halfDToEnd += halfValue;
        } else {
            // Efter d-segmentet
            halfDToEnd += value;
        }
    });

    return {
        hasD: true,
        startToHalfD,
        halfDToEnd
    };
}

export function calculateCCSegmentData(
    segment, 
    rawSegments, 
    isDepthActive, 
    side, 
    depthLeftVal, 
    depthRightVal,
    isCosActive = false,
    cosValue = 145,
    cosDrain = 'left',
    hsValue = 560,
    hsSide = 'left'
) {
    let match = segment.match(/^([+-]?)(hs|[dh])([0-9]+)$/);
    if (!match) return null;

    let typeChar = match[2];
    let fullNum = parseInt(match[3], 10);
    let halfNum = fullNum / 2;
    let labelType = (typeChar === 'd') ? 'CC Diskho' : 'CC Häll';

    // Anger om det aktuella segmentet är ett 'd'-mått
    const hasDSegment = (typeChar === 'd');

    // Hantering av 'hs' (Hällskarv)
    if (typeChar === 'hs') {
        let offset = Math.round((fullNum - hsValue) / 2);
        let minSum = halfNum - offset;
        let minText = `${halfNum} - ${offset}`;
        let maxSum = halfNum + offset;
        let maxText = `${halfNum} + ${offset}`;

        return {
            labelType: 'CC Häll',
            hasDSegment: false,
            minText,
            minSum,
            maxText,
            maxSum,
            isCosActive: false,
            minPlateText: "",
            minPlateSum: 0,
            maxPlateText: "",
            maxPlateSum: 0
        };
    }

    // Hantering av 'd' och 'h' utifrån den grupp de tillhör
    let groupSegments = [];
    let currentGroup = [];

    rawSegments.forEach((seg) => {
        let isGroupSplitter = seg.match(/^([+-]?)(s|hs)[0-9]+$/);
        if (isGroupSplitter && currentGroup.length > 0) {
            groupSegments.push(currentGroup);
            currentGroup = [seg];
        } else {
            currentGroup.push(seg);
        }
    });
    if (currentGroup.length > 0) {
        groupSegments.push(currentGroup);
    }

    let targetGroupIndex = groupSegments.findIndex(group => group.includes(segment));
    let targetGroup = targetGroupIndex !== -1 ? groupSegments[targetGroupIndex] : rawSegments;

    let isFirstGroup = (targetGroupIndex === 0 || targetGroupIndex === -1);
    let isLastGroup = (targetGroupIndex === groupSegments.length - 1 || targetGroupIndex === -1);

    let leftSequence = [];
    let rightSequence = [];
    let foundLetterSegment = false;

    targetGroup.forEach((seg) => {
        let segMatch = seg.match(/^([+-]?)(hs|[dhs])?([0-9]+)$/);
        if (!segMatch) return;

        let segSign = segMatch[1] === '-' ? -1 : 1;
        let cleanSegNum = parseInt(segMatch[3], 10) * segSign;

        if (seg === segment) {
            let finalHalf = halfNum * segSign;
            leftSequence.push(finalHalf);
            rightSequence.push(finalHalf);
            foundLetterSegment = true;
        } else {
            if (!foundLetterSegment) {
                leftSequence.push(cleanSegNum);
            } else {
                rightSequence.push(cleanSegNum);
            }
        }
    });

    let leftSum = leftSequence.reduce((a, b) => a + b, 0);
    let rightSum = rightSequence.reduce((a, b) => a + b, 0);

    // Tillämpa djupavdrag om gruppen ligger i ytterkant
    if (isDepthActive) {
        if (isFirstGroup && (side === 'left' || side === 'both')) {
            leftSum = -depthLeftVal + leftSum;
        }
        if (isLastGroup && (side === 'right' || side === 'both')) {
            rightSum = rightSum - depthRightVal;
        }
    }

    function buildSeqStr(seq) {
        return seq.map((num, i) => {
            if (i === 0) return num.toString();
            if (num >= 0) return `+ ${num}`;
            return `- ${Math.abs(num)}`;
        }).join(' ');
    }

    let leftTextStr = buildSeqStr(leftSequence);
    let rightTextStr = buildSeqStr(rightSequence);

    if (isDepthActive) {
        if (isFirstGroup && (side === 'left' || side === 'both')) {
            leftTextStr = `- ${depthLeftVal} ` + (leftSequence[0] >= 0 ? '+ ' : '') + leftTextStr;
        }
        if (isLastGroup && (side === 'right' || side === 'both')) {
            rightTextStr = rightTextStr + ` - ${depthRightVal}`;
        }
    }

    // Standard CC-diskho / häll (oberoende beräkning)
    let isLeftShorter = leftSum <= rightSum;

    let minText = isLeftShorter ? leftTextStr : rightTextStr;
    let minSum = isLeftShorter ? leftSum : rightSum;
    let maxText = isLeftShorter ? rightTextStr : leftTextStr;
    let maxSum = isLeftShorter ? rightSum : leftSum;

    // COS/COB-PLÅT BERÄKNING (Endast för diskho 'd', helt oberoende beräkning)
    let minPlateText = "";
    let minPlateSum = 0;
    let maxPlateText = "";
    let maxPlateSum = 0;

    if (isCosActive && typeChar === 'd') {
        let C = parseInt(cosValue, 10) || 145;
        let leftPlateSum = 0;
        let leftPlateText = "";
        let rightPlateSum = 0;
        let rightPlateText = "";

        if (cosDrain === 'left') {
            leftPlateSum = leftSum - C;
            leftPlateText = `${leftTextStr} - ${C}`;

            rightPlateSum = C + rightSum;
            rightPlateText = `${C} + ${rightTextStr}`;
        } else if (cosDrain === 'right') {
            leftPlateSum = leftSum + C;
            leftPlateText = `${leftTextStr} + ${C}`;

            rightPlateSum = -C + rightSum;
            rightPlateText = `-${C} + ${rightTextStr}`;
        }

        // Oberoende kontroll för vilket plåtvärde som är kortast
        let isPlateLeftShorter = leftPlateSum <= rightPlateSum;

        minPlateSum = isPlateLeftShorter ? leftPlateSum : rightPlateSum;
        minPlateText = isPlateLeftShorter ? leftPlateText : rightPlateText;
        maxPlateSum = isPlateLeftShorter ? rightPlateSum : leftPlateSum;
        maxPlateText = isPlateLeftShorter ? rightPlateText : leftPlateText;
    }

    return {
        labelType,
        hasDSegment,
        minText,
        minSum,
        maxText,
        maxSum,
        isCosActive: isCosActive && typeChar === 'd',
        minPlateText,
        minPlateSum,
        maxPlateText,
        maxPlateSum
    };
}