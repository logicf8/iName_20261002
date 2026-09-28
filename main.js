import SectionPortfolio from './core/shared/models/sectionPortfolio.js' 
import { processLines } from './core/1_parser/handlers/processLines.js';
import { switchByHeaderVM } from './core/2_processors/headerSwitchVM.js'
import { switchByHeaderDT } from './core/4_generators/descriptionGenerator/headerSwitchDT.js';
import { buildArticleTestArrayFromFile, initArticleSequenceTest, finalizeArticleSequenceTest } from "./core/1_parser/tests/articleSequenceTest.js";
export const currentSectionPortfolio = new SectionPortfolio();
import { generateReports } from './core/4_generators/reportGenerator/index.js';
import { getCpFamilies } from './core/4_generators/coverPanelGenerator/getCoverPanels.js'
import { runValidationPipeline } from './core/3_validators/validatorEngine.js'

export function makeTestArray(lines){
  const testArray = buildArticleTestArrayFromFile(lines);
  initArticleSequenceTest(testArray);
}

export function makeReport(){
  const report = finalizeArticleSequenceTest();
  console.log(JSON.stringify(report, null, 2));
  currentSectionPortfolio.returnHeaders().forEach(header => {
     if(header.constructor.name !== "CoverPanelHeader"){
      if(header.missingAlert.length > 0) {console.log(header.missingAlert)}
    }
  });
}

export function main(lines){
  Object.assign(currentSectionPortfolio, new SectionPortfolio());

  processLines(lines, currentSectionPortfolio);
  switchByHeaderVM(currentSectionPortfolio);
  switchByHeaderDT(currentSectionPortfolio);
  generateReports(currentSectionPortfolio);
  runValidationPipeline(currentSectionPortfolio);
  getCpFamilies(currentSectionPortfolio);  
  return currentSectionPortfolio.returnDisplayTxts();
}