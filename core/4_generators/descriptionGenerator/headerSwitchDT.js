import { setBaseCabWarrantyTxt, washershoutDown, setHighCabWarrantyTxt, setFreeStandingWarrantyTxt, IlandWarrantytxt } from './addWarantyTxt.js';
import { createDisplayTxtCombo, noSuspensionRailHighCab, noSusRailWallOnWorkT } from './comboTxtCreate.js';
import { createFsDisplayName } from './freeStandingTxtCreate.js';
import { openTxt } from './openTxtCreate.js';
import { makeHeaderTxt, DtByArt } from './customMadeTxtCreate.js';
import { workTopCfg } from '../customMadeConfigs/workTopCfg.js';
import { wallPanelCfg } from '../customMadeConfigs/wallPanelCfg.js';
import { noNrHeaders } from '../../1_parser/utils/headerLineIdentifiers.js';
import { cPanels, handels, otherArt } from './secondStageTxt.js';
import { filter } from '../../shared/global/myConstants.js';
import { artAddTxt, artAddTxtHinge } from './artTxtCreate.js';
import { artEmptyCorner } from './artCorner.js';

export function switchByHeaderDT(sectionPortfolio) {
  let wTcount = 0, wPcount = 0;

  // Första pass: skapa headers och DtByArt
  sectionPortfolio.returnHeaders().forEach(header => {
    if(header.constructor.name === "SecondStageHeader") {
      switch(header.originalTxt) {

        case "Bänkskiva": // Bänkskiva
          if(wTcount === 0) {
            makeHeaderTxt(sectionPortfolio, workTopCfg);
            wTcount = 99;
          }
          DtByArt(sectionPortfolio, header, workTopCfg);
          break;

        case "Väggplatta": // Väggplatta
        case "Väggpanel":
          if(wPcount === 0) {
            makeHeaderTxt(sectionPortfolio, wallPanelCfg);
            wPcount = 99;
          }
          DtByArt(sectionPortfolio, header, wallPanelCfg);
          break;
      }
    }
  });

  // Second pass: skapa displayTxt etc.
  sectionPortfolio.returnHeaders().forEach(header => {
    header.number = header.originalTxt.split('.')[0];

    switch(header.constructor.name) {

      case "CoverPanelHeader":
        artEmptyCorner(sectionPortfolio, header);
        break;

      case "CombinationHeader":
        createDisplayTxtCombo(sectionPortfolio, header);

        if(header.type === filter.Cabinet.group2.Base) { // Bänkskåp
          setBaseCabWarrantyTxt(sectionPortfolio, header);
          washershoutDown(sectionPortfolio, header);
        } else if(header.type === filter.Cabinet.group2.High) { // Högskåp
          setHighCabWarrantyTxt(sectionPortfolio, header);
          noSuspensionRailHighCab(sectionPortfolio, header);
        }
        else if(header.type === filter.Cabinet.group2.Wall) {
            noSusRailWallOnWorkT(sectionPortfolio, header);
        }

        if(header.forFlags.sink === true) {
          artAddTxt(sectionPortfolio, header);
        }

        const activeHinges = Object.entries(header.hingeFlags)
          .filter(([, value]) => value > 0)
          .map(([type, count]) => ({ type, count }));

        if(activeHinges.length >= 2) {
          artAddTxtHinge(activeHinges, sectionPortfolio)
        }
        break;

      case "OpenHeader":
        openTxt(sectionPortfolio, header);
        break;

      case "CombinationFreeStanding":
        createFsDisplayName(sectionPortfolio, header);
        setFreeStandingWarrantyTxt(sectionPortfolio, header);
        break;

      case "SecondStageHeader":
        switch(header.originalTxt) {

          case noNrHeaders[0]: break; // Skena
          case noNrHeaders[1]: IlandWarrantytxt(sectionPortfolio, header); break; // Ben och socklar
          case noNrHeaders[2]: cPanels(sectionPortfolio); break; // Täcksidor
          case noNrHeaders[3]: break;
          case noNrHeaders[4]: 
          case noNrHeaders[5]: handels(sectionPortfolio, header); break; // Knoppar handtag
          case noNrHeaders[6]: break; // Bänkskiva
          case noNrHeaders[7]: break; // Väggplatta
          case noNrHeaders[8]: break; // Belysningstillbehör
          case noNrHeaders[9]: break; // Matplats
          case noNrHeaders[10]:
          case noNrHeaders[11]: otherArt(sectionPortfolio, header); break; // Övrigt / Andra produkter
          default:
            // header.displayTxt = header.originalTxt;
            break;
        }
        break;
    }
  });
}
