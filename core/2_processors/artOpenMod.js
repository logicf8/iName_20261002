// artValuesOpen.js

import { filter } from "../shared/global/myConstants.js";

export function artValuesOpen(header) {
  header.returnArticles().forEach(article => {
    switch (article.group1) {

      case filter.CabTyp2.group1: {
        buildCabTyp2Description(header, article);
        combinationSize(header, article);
        
        break;
      }

      case filter.StommeEnhet.group1: {
        header.description = `${article.description} ${article.width} cm, med hyllplan (Enhet)`;
        combinationSize(header, article);
        break;
      }
      case filter.Mixed.group1: {
        header.description = `${article.description} ${article.width} cm (${article.name})`
        break; //Väggskåp med skjutdörrar
      }

      default:
        break;
    }
  });

} 

function buildCabTyp2Description(header, article) {

  if (header.description === undefined) {
    header.description = buildBaseDescription(header, header.originalTxt);
    header.description += ` ${article.width} cm`;

    if (isSuffixGroup(article.group2)) {
      header.description += ` - ${article.group2}`;
    }

  } else {
    if (isSuffixGroup(article.group2)) {
      header.description += `/${article.group2}`;
    }
  }
  if (header.originalTxt.includes("bänkskåp")) { header.type = "Bänkskåp";}
}

/**
 * Avgör grundtext baserat på originaltext
 */
function buildBaseDescription(header, originalTxt = "") {
  const text = originalTxt.toLowerCase();

  if (text.includes("bänkskåp")) { header.type = "Bänkskåp"; return "Öppet bänkskåp" };
  if (text.includes("väggskåp")) {
    header.type = "Väggskåp";
    return "Öppet väggskåp";
  }

  return "Öppet skåp";
}

/**
 * Samma grupp2-logik som originalet (case-känslig rådata)
 */
function isSuffixGroup(group2) {
  return group2 === "vinhylla" || group2 === "lådsektion";
}

/**
 * Summerar mått
 */
function combinationSize(header, article) {
  header.width = parseInt(article.width, 10);
  header.depth = parseInt(article.depth, 10);
  header.height = (header.height || 0) + parseInt(article.height, 10);
}
