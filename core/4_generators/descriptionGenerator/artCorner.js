import { addDisplayTxt } from "./displayTxtHelpers.js";

export function artEmptyCorner(sectionPortfolio, header) {

  const found = header.returnArticles()
    .some(article => article.artNr === "702.746.28");

  if(found){
    addDisplayTxt(sectionPortfolio.displayTxts, {
      text: `${header.number}. Vinklar för att stödja bänkskivan i tomt- hörn`,
      level: "info"
    });
  }
}