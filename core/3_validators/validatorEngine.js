//C:\PRIVAT\MinaProgram\iName reStructured\core\3_validators\validatorEngine.js
import { cabColors } from './logic/cabColors.js';
import { drawerColors } from './logic/drawerColors.js';
import { familyTypes } from './logic/familyTypes.js';

import { 
  collectShelfData,
  analyzeShelfOrders 
} from './logic/shelfTypeColor.js';

import {
  cabColorTxt,
  drawerColorTxt,
  shelfColorTxt,
  familyTypesTxt,
  glassCompareTxt,
  outerWidthHeightTxt,
  innerHeightTxt,
  benchLightTypeWidthTxt,
  spotLightCheckTxt,
  pushAndOpenTxt,
  drawerLightsTxt,
  hingeCompareTxt,
  variousControllTxt,
  drawerFrontCompareTxt,
  unusualDrawerCombinationsTxt
} from './presenters/index.js';

import { 
  collectOuterWidthHeightData,
  analyzeOrders as analyzeOuter 
} from "./logic/outherHightCheck.js";

import { 
  collectInnerHeightData,
  analyzeInnerHeightOrders 
} from './logic/innerHeight.js';
import { benchLightTypeWidth } from './logic/benchLightValidator.js';
import { 
  collectSpotLightData, 
  analyzeSpotOrders 
} from "./logic/spotLightCheck.js";
import { collectDrawersAndGlassByDepthAndHeight, analyzeOrders } from "./logic/glassCompare.js";
import { collectPushAndOpenData, analyzeOrders as analyzePnO } from "./logic/pushAndOpen.js";
import { collectDrawerLights, analyzeDrawerLights } from "./logic/drawerLights.js";
import { collectHingeData, analyzeHinges } from "./logic/hingeCompare.js";
import { variousControll } from "./logic/variousControll.js";
import { 
  collectDrawerFrontData, 
  analyzeDrawerFronts 
} from "./logic/drawerFrontCompare.js";
import { 
  collectUnusualDrawerData,
  analyzeUnusualDrawerOrders
} from "./logic/unusualDrawerCombinations.js";


export function runValidationPipeline(sP) {

  // 🔽 glassidor analys
  const drawerData = collectDrawersAndGlassByDepthAndHeight(sP);
  const glassResult = analyzeOrders(drawerData);

  const drawerFrontData = collectDrawerFrontData(sP);
  const drawerFrontResult = analyzeDrawerFronts(drawerFrontData);
    // 🔽 push-open analys
  const pnoData = collectPushAndOpenData(sP);
  const pnoResult = analyzePnO(pnoData);

  // ----------------------
  // Färgtester
  // ----------------------

  const resultCabColors = cabColors(sP);
  const resultDrawerColors = drawerColors(sP);
  const shelfData = collectShelfData(sP);
  const resultShelf = analyzeShelfOrders(shelfData);
  const resultFamilyColor = familyTypes(sP);

  // ----------------------
  // Inner höjd
  // ----------------------
  const innerData = collectInnerHeightData(sP);
  const resultInner = analyzeInnerHeightOrders(innerData);
  // ----------------------
  // Bench Light Type Width
  // ----------------------

  const resultLight = benchLightTypeWidth(sP);

  // 🔽 drawer lights analys

  const drawerLightData = collectDrawerLights(sP);
  const drawerLightResult = analyzeDrawerLights(drawerLightData);
  
  // 🔽 spotLight analys
  const spotData = collectSpotLightData(sP);
  const spotResult = analyzeSpotOrders(spotData);

  // ----------------------
  // Outer Width/Height
  // ----------------------
  const outerData = collectOuterWidthHeightData(sP);
  const outerResult = analyzeOuter(outerData);

  const hingeData = collectHingeData(sP);
  const hingeResult = analyzeHinges(hingeData);

  const unusualDrawerData = collectUnusualDrawerData(sP);
  const unusualDrawerResult = analyzeUnusualDrawerOrders(unusualDrawerData);


  const variousResult = variousControll(sP);

  
  familyTypesTxt(sP, resultFamilyColor);
  cabColorTxt(sP, resultCabColors);
  drawerColorTxt(sP, resultDrawerColors);
  glassCompareTxt({
    ...sP,
    orders: drawerData
  }, glassResult);
  drawerFrontCompareTxt(sP, drawerFrontResult);
  unusualDrawerCombinationsTxt(sP, unusualDrawerResult);
  hingeCompareTxt(sP, hingeResult);
  shelfColorTxt(sP, resultShelf);
  benchLightTypeWidthTxt(sP, resultLight);
  spotLightCheckTxt(sP, spotResult);
  drawerLightsTxt(sP, drawerLightResult);
  pushAndOpenTxt({
    ...sP,
    pnoOrders: pnoData
  }, pnoResult);
  outerWidthHeightTxt(sP, outerResult);
  innerHeightTxt(sP, resultInner); 
  variousControllTxt(sP, variousResult);

}