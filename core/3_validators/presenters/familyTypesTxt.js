import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';

export function familyTypesTxt(sP, resultFamilyTypes) {

  let colorText = "🟩 Nej";
  let rows = [];
  let pic = "fronts.png";

  if (resultFamilyTypes) {

    const { status, colors } = resultFamilyTypes;

    const keys = Object.keys(colors || {});

    if (keys.length === 0) {
      colorText = `${status} Nej`;
    } else if (keys.length === 1) {
      colorText = `${status} ${keys[0]}`;
    } else {
      colorText = `${status} ${keys.join(" / ")}`;
    }

    rows = keys.map(key => ({
      color: key,
      numbers: colors[key].numbers
    }));
  }

  createValidationEntry(sP.checkTxts, {
    title: "Frontfamilj",
    text: colorText,
    level: "info",
    pic,
    rows,
    message:
      helpMessages.familyTypes
  });
}