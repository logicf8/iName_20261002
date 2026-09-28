import { isNrHeader  } from "../utils/headerPatternIdentifiers.js";
import { nrCpFpHeaders, nrOpenHeaders, noNrHeaders } from "../utils/headerLineIdentifiers.js";
import CoverPanelHeader from "../../shared/models/coverPanelHeader.js"
import CombinationHeader from "../../shared/models/combinationHeader.js"
import OpenHeader from "../../shared/models/openHeader.js"
import SecondStageHeader from "../../shared/models/secondStageHeader.js"
import { switchLines } from "./articleExtractor.js";
import { extractCoverPanelOrFittingPieceData } from "./cPfPExtractor.js";

let currentHeader = undefined;
let headerLine = false;

export function processLines(lines, currentSectionPortfolio) {

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    if(line.includes("Design-ID:")){
      currentSectionPortfolio.drawNR = line.split(" ")[1];
    }


    if(isNrHeader(line)){
      const idx = line.indexOf(".");
      let withOutNR = idx === -1 ? "" : line.slice(idx + 1).trim();
  
      const cpOrFpMatch = nrCpFpHeaders.includes(withOutNR);
      const openCabMatch = nrOpenHeaders.includes(withOutNR);
      if (cpOrFpMatch) {
        currentHeader = new CoverPanelHeader(line)
        extractCoverPanelOrFittingPieceData(currentHeader, line);
        currentSectionPortfolio.addCpFpHeader(currentHeader)
        if(line.includes("Fristående passbit för nedre hörn")){
          currentSectionPortfolio.cmInfoFlag.corners += 1;
        }
        
        }
      else if(openCabMatch) {
        currentHeader = new OpenHeader(line)
        currentSectionPortfolio.addOpenHeader(currentHeader)
      }
      else {
        currentHeader = new CombinationHeader(line)
        currentSectionPortfolio.addCombinationHeader(currentHeader)
      }
      continue;
    }

    if(noNrHeaders.includes(line)){
      currentHeader = new SecondStageHeader(line)
      currentSectionPortfolio.addSecondStageHeader(currentHeader)
      headerLine = true
      continue;
    }

    if(!currentHeader) { continue; }
    else { 
      let newHeader = switchLines(currentHeader, line, currentSectionPortfolio)
      if(newHeader !== undefined) {currentHeader = newHeader;}
    }
  }
}