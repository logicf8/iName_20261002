//C:\PRIVAT\MinaProgram\iName\ValueModifiers\headerSwitchVM.js
import { meValuesIfNeeded } from './meHandler/txtExtractorME.js';
import { artValuesModifyComb } from './artCombMod.js';
import { forButNotInCombo } from './artCoSecondPass.js';
import { artForFlagAdd } from './artForFlagAdd.js';
import { artValuesModifyFreeS } from './artFreeStandMod.js';
import { artValuesOpen } from './artOpenMod.js';
import { artEmptyCorner } from '../4_generators/descriptionGenerator/artCorner.js';
import { filter } from '../shared/global/myConstants.js';
import { forButNotInFS } from './artFsSecondPass.js';
import { checkMaterialsAntQuantity } from './preInfoWT.js';

export function switchByHeaderVM(sectionPortfolio) {

  sectionPortfolio.cmInfoFlag ??= {};

  sectionPortfolio.cmInfoFlag.wtInfo ??= {
    stats: 0,
    message: "",
    count: 0,
    preCut: 0,
    firstCustomArticle: null,
    underglued: []
  };

  sectionPortfolio.cmInfoFlag.wpInfo ??= {
    stats: 0,
    message: "",
    count: 0,
    preCut: 0,
    firstCustomArticle: null,
    underglued: []
  };

  sectionPortfolio.returnHeaders().forEach(header => {

    if(header.constructor.name !== "SecondStageHeader") {
      header.number = header.originalTxt.split('.')[0];
    }

    switch(header.constructor.name) {

      case "CoverPanelHeader":
        break;

      case "CombinationHeader":
        artValuesModifyComb(sectionPortfolio, header);
        meValuesIfNeeded(header);
        forButNotInCombo(header);
        artForFlagAdd(header);
        break;

      case "OpenHeader":
        artValuesOpen(header);
        break;

      case "CombinationFreeStanding":
        meValuesIfNeeded(header);
        artValuesModifyFreeS(sectionPortfolio, header);
        forButNotInFS(header);
        // setFreeStandingWarrantyTxt(header);
        break;

      case "SecondStageHeader":
        switch(header.originalTxt) {

          case "Bänkskiva": // Bänkskiva
            sectionPortfolio.cmInfoFlag.wtInfo = checkMaterialsAntQuantity(header);
            break;

          case "Väggplatta": // Väggplatta
          case "Väggpanel":
            sectionPortfolio.cmInfoFlag.wpInfo = checkMaterialsAntQuantity(header);
            break;
        }
        break;
    }

  });
}
