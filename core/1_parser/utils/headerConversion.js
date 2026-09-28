// utils/headerConversion.js
import CombinationFreeStanding from "../../shared/models/combinationFreeStanding.js";

export function promoteToFreeStanding(oldHeader) {

    const newHeader = new CombinationFreeStanding(oldHeader.originalTxt);

    newHeader.number = oldHeader.number;
    newHeader.displayTxt = oldHeader.displayTxt;
    newHeader.description = oldHeader.description;

    newHeader.articles = [...oldHeader.articles];
    newHeader.missingAlert = [...oldHeader.missingAlert];
    newHeader.expAlert = [...oldHeader.expAlert];
    newHeader.attachedPOF = oldHeader.attachedPOF;
    return newHeader;
}

export function replaceHeaderInPortfolio(portfolio, oldHeader, newHeader) {
    const idx = portfolio.headers.indexOf(oldHeader);
    if (idx !== -1) {
        portfolio.headers[idx] = newHeader;
    }
}
