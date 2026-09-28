import { filter } from "../../shared/global/myConstants.js";
import { addDisplayTxt } from "./displayTxtHelpers.js";

const startTxt = "( ! ) Viktigt för garantin -"
let found = false;


export function washershoutDown(sP, header){
  const shotDown = filter.Tap.group1;

  header.returnArticles().forEach(article => {
    if (!article) {
      console.log("🚨 undefined article", header);
      return;
    }

    if (article.group1 === shotDown && article.artNr !== "303.416.44" && article.artNr !== "403.059.52") {
      addDisplayTxt(sP.displayTxts, {
        text: "Blandare, köp till diskmaskinsavstängning hos annan leverantör!",
        level: "info"
      });
    }
  });
}

export function setBaseCabWarrantyTxt(sP, header){
  const wtInfo = sP.cmInfoFlag?.wtInfo;
  let material = wtInfo?.firstCustomArticle?.color;

  if(header.forFlags.sink){
    addDisplayTxt(sP.displayTxts, {
      text: `${startTxt} Hyllplansskydd & tätningssats. Vattenlarm köps från annan leverantör!`,
      level: "info"
    });
  }
  else if(header.forFlags.oven || header.forFlags.combiMicro || header.forFlags.compactOven){
    if(!material && wtInfo?.preCut > 0){ //Endast färdiga längder
      let txt = `${startTxt} Diffusionsspärr`
      sP.needDiff = true;
      if(header.forFlags.oven){
        txt += ". Ugn ska placeras på konsol"
      }
      addDisplayTxt(sP.displayTxts, {
        text: txt,
        level: "info"
      });
    }

/*
stats	Betydelse
1	Samma namn, beskrivning & material
2	Samma material
3	Endast laminat/faner
4	Endast kompositmaterial
5	Blandning av enkla + komposit
*/

    switch(wtInfo?.stats){
        case 1: 
        case 2:
        case 3:
        case 5: {
          if( material === "laminat" || material === "faner" || wtInfo.preCut > 0){
            let txt = `${startTxt} Diffusionsspärr`
            if(header.forFlags.oven){
              txt += ". (Ugn placeras på konsol)";
            } 
            sP.needDiff = true;
            addDisplayTxt(sP.displayTxts, {
              text: txt,
              level: "info"
            });
          }
          else if(header.forFlags.oven){
            addDisplayTxt(sP.displayTxts, {
              text: "Obs! Ugn placeras på konsol",
              level: "info"
            });
          }
        } break;
        case 6: {
          if(wtInfo?.preCut > 0){
            sP.needDiff = true;
            addDisplayTxt(sP.displayTxts, {
              text: `${startTxt} Diffusionsspärr`,
              level: "info"
            });
          }
        } break;
    }
  }

  else if(header.forFlags.hob){
    addDisplayTxt(sP.displayTxts, {
      text: `${startTxt} Hällskydd`,
      level: "info"
    });
  }
  else if(header.forFlags.hobFan){
    if(header.drawerFront === 2) {
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Hällskydd av blind- innerlådsfront`,
        level: "info"
      });

    }    
  }
}
export function setHighCabWarrantyTxt(sP, header){
  if(header.forFlags.fridgeOrF){
    let txtTemp = "(!) Viktigt för garantin -"
    addDisplayTxt(sP.displayTxts, {
      text: `${txtTemp} Hyllplansskydd & ventilation. Hyllplansskydd köps av annan leverantör!`,
      level: "info"
    });
  }
}

export function setFreeStandingWarrantyTxt(sP, header){
  const wtInfo = sP.cmInfoFlag?.wtInfo;
  let material = sP.cmInfoFlag?.wtInfo?.firstCustomArticle?.color;
 
  if(header.group2 === "Diskmaskin"){
    if(!material && wtInfo?.preCut > 0){
        if( material === "laminat" || material === "faner" || wtInfo.preCut > 0){
          addDisplayTxt(sP.displayTxts, {
          text: `${startTxt} Golvskydd och diffusionsspärr. (D.spärr medföljer IKEAs diskmaskiner)`,
          level: "info"
        });
      }       
    }

    switch(wtInfo.stats){
        case 1: 
        case 2:
        case 3:
        case 5: {
          if( material === "laminat" || material === "faner" || wtInfo.preCut > 0){
            addDisplayTxt(sP.displayTxts, {
              text: `${startTxt} Golvskydd och diffusionsspärr. (D.spärr medföljer IKEAs diskmaskiner)`,
              level: "info"
            });
          } 
          else{
            addDisplayTxt(sP.displayTxts, {
              text: `${startTxt} Golvskydd.`,
              level: "info"
            });
          }
      } break;
      case 6:{
            addDisplayTxt(sP.displayTxts, {
              text: `${startTxt} Golvskydd.`,
              level: "info"
            });
      }break;
    }   
  }
  else if (header.group2 === "Kyl/Frys"){
    if(header.name === "SPELNÄS"){
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Golvskydd. Golvskydd köps av annan leverantör!`,
        level: "info"
      });
    }
    else{
      addDisplayTxt(sP.displayTxts, {
        text: `${startTxt} Golvskydd och ventilation`,
        level: "info"
      });
    }
  }
}

export function IlandWarrantytxt(sP, header){

  header.returnArticles().forEach(article => {
    switch(article.artNr){
      case "805.570.33": {
        if(!found){ headerLegsAndPlints(sP) }
          addDisplayTxt(sP.displayTxts, {
            text: `${startTxt} Köksö ska golvförankras`,
            level: "info"
          });
      } break;
      case "805.570.28": {
        if(!found){ headerLegsAndPlints(sP) }
          addDisplayTxt(sP.displayTxts, {
            text: "Kopplingslist möjliggör infästning på baksida av stommar",
            level: "info"
          });
      } break;
    }  
  });
}

function headerLegsAndPlints(sP){
  addDisplayTxt(sP.displayTxts, {
    text: "Ben, socklar och tillbehör köksö",
    level: "info"
  });
  found = true;
}

export function meVentWarranty(sP){
  addDisplayTxt(sP.displayTxts, {
    text: `${startTxt} Ventilation i takanslutning ovanför kyl/frys`,
    level: "info"
  });
}

