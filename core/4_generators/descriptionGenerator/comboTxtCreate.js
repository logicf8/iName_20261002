import { addDisplayTxt } from "./displayTxtHelpers.js";

export function createDisplayTxtCombo(sP, header) {

    let displayName = `${header.number}. ${header.description}`;
    // -----------------------------------------------------
    //  1. Vitvaror (forFlags)
    // -----------------------------------------------------
    const appParts = [];
    const f = header.forFlags;
    let bypass = false;

    if (f.oven && f.combiMicro) appParts.push("ugn och kombimikrovågsugn");
    else if (f.oven && f.micro) appParts.push("ugn och mikrovågsugn");
    else if (f.oven && f.compactOven) appParts.push("ugn och kompaktugn");
    else if (f.compactOven && f.micro) appParts.push("kompaktugn och mikrovågsugn");
    else if (f.combiMicro && f.micro) appParts.push("kombimikrovågsugn och mikrovågsugn");
    else if (f.hob && f.oven) appParts.push("häll och ugn");
    else if (f.hob && f.combiMicro) appParts.push("häll och kombimikrovågsugn");
    else if (f.hob && f.compactOven) appParts.push("häll och kompaktugn");
    else if (f.hob && f.micro) appParts.push("häll och mikrovågsugn");
    else if (f.hob) appParts.push("häll");
    else if (f.hobFan) appParts.push("häll med inbyggd fläkt");
    else if (f.ugn) appParts.push("ugn");
    else if (f.compactOven) appParts.push("kompaktugn");
    else if (f.combiMicro) appParts.push("kombimikrovågsugn");
    else if (f.micro) appParts.push("mikrovågsugn");
    else if (f.fan) appParts.push("fläkt");
    else if (f.sink) appParts.push("diskho");
    else if (f.fridgeOrF) { appParts.push(header.applianceDescription); bypass = true };

    if (appParts.length > 0) {
        displayName += " för " + appParts.join(", ");
    }
    if(!bypass){ 
    // -----------------------------------------------------
    //  2. withFlags
    // -----------------------------------------------------
    const w = header.withFlags;
    const f = header.hingeFlags;
    const flagList = [];

    // Grupp 1 — Om någon är true, stoppa resten
    if (w.pullOut > 0) flagList.push("utdragsfunktion");
    if (w.carousel > 0) flagList.push("karusell");
    if (w.pullCorner > 0) flagList.push("utdragbar inredning");
    if (w.larder > 0) flagList.push("skafferiutdrag");
    if (w.cleaningInt > 0) flagList.push("städskåpsinredning");
    
    if (flagList.length === 0) {
        // Grupp 2 — körs bara om ingen i grupp 1 var true
        let oFrontDrawersNr = outDrawCheck(header); 
        
        if (w.drawers > 0) { //Det finns lådor
            if(blindCheck(header)) {

                if (oFrontDrawersNr > 0) flagList.push(oFrontDrawersNr === 1 ? "låda" : "lådor");
                if (w.innerDF > 0) flagList.push(w.innerDF === 1 ? "innerlåda" : "innerlådor");
            }
            else if (oFrontDrawersNr === 0){ //Inga yttre lådfronter
                
                flagList.push(w.innerDF === 1 ? "innerlåda" : `${w.innerDF} st innerlådor`);
            }
            else {            
                let txt = w.drawers === 1 ? "låda" : `${w.drawers} lådor`
                if(w.innerDF > 0){ 
                txt += w.innerDF === 1 ? ` varav en dold innerlåda` : ` varav ${w.innerDF} dolda innerlådor`
                }
                 flagList.push(txt)
            }
            
        }
        if (w.wireBaskets > 0) flagList.push(w.wireBaskets === 1 ? "trådback" : "trådbackar");
        if (w.workSerfaces > 0) flagList.push(w.workSerfaces === 1 ? "arbetsyta" : "arbetsytor");
        if (w.conectFronts > 0) flagList.push("ihopkopplade fronter");
        if (blindCheck(header)) flagList.push("blindfront");
        

        if (f.hHorr > 0) { //Horisontella gångjärn
            let check = freeOutFronts(header);
            if(f.hHorr === check) { flagList.push(f.hHorr === 1 ? "horisontell dörr" : "horisontella dörrar"); }
            else if(f.hHorr === w.glasDoors && check === 0){ flagList.push(f.hHorr === 1 ? "horisontell vitrindörr" : "horisontella vitrindörrar"); w.glasDoors -= f.hHorr}
            else if(f.hHorr === check + w.glasDoors) { flagList.push("horisontell; dörr och vitrindörr"); w.glasDoors -= (f.hHorr - check) }
        }
        if (w.glasDoors > 0) flagList.push(w.glasDoors === 1 ? "vitrindörr" : "vitrindörrar");
        if (w.doors > 0) flagList.push(w.doors === 1 ? "dörr" : "dörrar");
        if(header.type !== "Bänkskåp" && f.compactOven !== true){
            if (w.shelfs > 0) flagList.push("hyllplan");
        }
        
    }

    // Lägg till flaggorna i displayName
    if (flagList.length === 0) {
        addDisplayTxt(sP.displayTxts, {
            text: `${displayName}, utan inredning`,
            level: "info"
        });
        return;
    }
    if (flagList.length === 1) {
        displayName += ", med " + flagList[0];
    } else if (flagList.length === 2) {
        displayName += ", med " + flagList[0] + " och " + flagList[1];
    } 
    else {
        const last = flagList.pop();
        displayName += ", med " + flagList.join(", ") + " och " + last;
    }
    }
    let thisState = "info"
    if(header.expAlert.length > 0){
        thisState = "expired"
    }

    header.displayTxt = displayName;
        addDisplayTxt(sP.displayTxts, {
            text: `${header.displayTxt}`,
            level: thisState
        });    
}

function freeOutFronts(header){
    let doCheck = header.drawersFlags.drawerFront + header.withFlags.innerDF - header.withFlags.drawers;
    return doCheck
}

function blindCheck(header){
  let doCheck = header.drawersFlags.drawerFront - (header.withFlags.drawers - header.withFlags.innerDF - header.hingeFlags.hHorr)
  if(doCheck === 1) {
    if(header.hingeFlags.hHorr !== 0 && header.withFlags.glasDoors === header.hingeFlags.hHorr) { return false; }
    return true }
  return false;
}

function outDrawCheck(header){
    let doCheck = header.withFlags.drawers - header.withFlags.innerDF;
    return doCheck;
}
function onlyOuterFronts(header){
    let doCheck = header.withFlags.drawers - header.withFlags.drawerFront;
    return doCheck === 0 ? true : false
}
export function noSuspensionRailHighCab(sP, header){
    if(header.height === 240){
        addDisplayTxt(sP.displayTxts, {
        text: `Överskåp skruvas direkt i vägg, högskåp hänger på skena`,
        level: "info"
    });
    return;
    }
}
export function noSusRailWallOnWorkT(sP, header){
    const meCodesNoSusRail = ["ME/MA 330","ME/MA 332", "ME/MA 334","ME/MA 337","ME/MA 338","ME/MA 368"]
        if (meCodesNoSusRail.includes(header?.meObject?.meCode)){

        addDisplayTxt(sP.displayTxts, {
        text: `Väggskåp på bänkskiva skruvas direkt i vägg, använd distans`,
        level: "warning"
    });
    return;
    }
}
//