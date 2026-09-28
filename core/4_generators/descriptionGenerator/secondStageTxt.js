import { addDisplayTxt } from "./displayTxtHelpers.js";
import { meVentWarranty } from './addWarantyTxt.js';

export function cPanels(sP) {
  addDisplayTxt(sP.displayTxts, {
    text: "Täcksidor - För placering se hantverksritning",
    level: "info"
  });
}

const GROUP_MAP = {
  "handtag": "handtag",
  "knopp": "knoppar",
  "tryck och öppna": "tryck & öppna beslag"
};

export function handels(sP, header) {
  const found = new Set();
  header.returnArticles().forEach(article => {
    const label = GROUP_MAP[article.group2];
    if (label) found.add(label);
  });
  let thisLevel = "info"
 
  if (found.size) {
    if(header.expAlert.length > 0) {thisLevel = "expired"; console.log(header.expAlert) }
    addDisplayTxt(sP.displayTxts, {
      text: capitalizeFirstWord(formatList([...found])),
      level: thisLevel
    });
        header.originalTxt = capitalizeFirstWord(formatList([...found]))
  }

}

const ARTICLE_ACTIONS = {
  "702.561.77": (sP) => {
    meVentWarranty(sP);
  },

  "702.746.28": (sP) => {
    addDisplayTxt(sP.displayTxts, {
      text: "Stödbeslag för fixering av täcksida / stödsida",
      level: "error"
    });
  }
};

export function otherArt(sP, header) {
  header.returnArticles().forEach(article => {
    ARTICLE_ACTIONS[article.artNr]?.(sP);
  });
}

function formatList(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(" och ");
  return items.slice(0, -1).join(", ") + " och " + items.at(-1);
}

function capitalizeFirstWord(text) {
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}