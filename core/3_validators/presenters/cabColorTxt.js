import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';

export function cabColorTxt(sP, resultCabColors) {

  let colorText = "🟩 Nej";
  let rows = [];
  let pic = "cabinets_mixed.png";

  if (resultCabColors) {

    const { status, sameColor, colors } = resultCabColors;

    const keys = Object.keys(colors || {});

    if (keys.length === 0) {
      colorText = `${status} Nej`;
    } else if (sameColor) {
      colorText = `${status} Alla, ${keys[0]}`;
    } else {
      colorText = `${status} Blandat, ${keys.join(" / ")}`;
    }

    rows = keys.map(color => ({
      color,
      numbers: colors[color].numbers
    }));

    pic = resultCabColors.pic || pic;
  }

  createValidationEntry(sP.checkTxts, {
    title: "Stomme",
    text: colorText,
    level: "info",
    pic,
    rows,
    message:
      helpMessages.cabColors
  });
}