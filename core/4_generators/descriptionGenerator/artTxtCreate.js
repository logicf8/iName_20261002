import { addDisplayTxt } from "./displayTxtHelpers.js";

export function artAddTxt(sP, header){
  header.returnArticles().forEach(article => {
    if(article.artNr === "702.272.36"){
      addDisplayTxt(sP.displayTxts, {
        text: `Elektronisk tryck & öppna - Kräver eluttag`,
        level: "info"
      });
      return;
    }
   });
}

export function artAddTxtHinge(activeHinges, sP){
  
  activeHinges.forEach(hinge => {
    if(hinge.type === "h110"){
        addDisplayTxt(sP.displayTxts, {
        text: `Till övre dörr: 110° gångjärn`,
        level: "warning"
      });
    }
  })
}

