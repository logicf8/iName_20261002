import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';

export function drawerColorTxt(sP, resultDrawerColors) {

  let colorText = "🟩 Nej"; // default (inga lådor)
  let rows = [];
  let pic = "drawer_mixed.png";

  if (resultDrawerColors) {

    const { status, sameColor, colors } = resultDrawerColors;

    const keys = Object.keys(colors || {});

    if (keys.length === 0) {
      // inga lådor
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

    pic = resultDrawerColors.pic || pic;
  }

  createValidationEntry(sP.checkTxts, {
    title: "Låda",
    text: colorText,
    level: "info",
    pic: pic,
    rows,
    message:
      helpMessages.drawerColors
  });
}