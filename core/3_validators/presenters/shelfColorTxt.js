import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';
import { filter } from '../../shared/global/myConstants.js';

export function shelfColorTxt(sP, result) {

const prepared = prepareHeaders(result, {
      sP,
      title: "Hyllplan",
      pic: "shelfs_mixed.png",
      message: "Inga relevanta stommar hittades."
    });

  if (!prepared) return;

  const { validHeaders, headers } = prepared;

  const rows = [
   cabinetInfoRow(validHeaders),
    {
      color: "Status\nHyllplan",
      numbers: validHeaders.map(h => h.status === false ? "❌" : "✅")
    },
    {
      color: "Hyllplan",
      numbers: validHeaders.map(h => {

        if (!h.shelves || h.shelves.length === 0) return "-";

        return (h.shelves || []).map(s =>
          `${s.width}x${s.depth} - ${s.color} (${s.quantity} st)`
        ).join("\n");

      })
    },
    {
      color: "Dörrar",
      numbers: validHeaders.map(h => {

        if (!h.doors || h.doors.length === 0) return "-";

        const glassDoorType = filter.Fronts.group3.GlassDoor;

        const glassDoors = (h.doors || [])
          .filter(d => d.group3 === glassDoorType)
          .map(d => `${d.width} x ${d.height} (${d.quantity} st)`);

        const normalDoors = (h.doors || [])
          .filter(d => d.group3 !== glassDoorType)
          .map(d => `${d.width} x ${d.height} (${d.quantity} st)`);

        const sections = [];

        if (glassDoors.length > 0) {
          sections.push(`Vitrindörr\n${glassDoors.join("\n")}`);
        }

        if (normalDoors.length > 0) {
          const normalType =
            h.doors.find(d => d.group3 !== glassDoorType)?.group2 || "Dörr";

          sections.push(`${normalType}\n${normalDoors.join("\n")}`);
        }

        return sections.join("\n\n");

      })
    }
  ];

  const colors = result.colors || [];

  let text = "Nej";

  if (colors.length === 1) {
    text = colors[0];
  } else if (colors.length > 1) {
    text = colors.join(", ");
  }

  let prefix = "🟩";

  if (result.globalStatus === "ERROR") {
    prefix = "🟥";
  }
  else if (result.globalStatus === "MISSING") {
    prefix = "🟥 ⚠️ Hyllplan saknas ⚠️";
  }
  else if (result.globalStatus === "TYPE_MISMATCH") {
    prefix = "🟥 ⚠️ Fel typ ⚠️";
  }
  else if (result.globalStatus === "COLOR_MIX") {
    prefix = "🟥";
  }

  text = `${prefix} ${text}`;
  let pic = "shelfs_mixed.png";

  if (colors.length === 1) {

    const color = colors[0].toLowerCase();

    if (color === "vit") pic = "shelfs_white.avif";
    else if (color === "svartgrå") pic = "shelfs_black.avif";
    else if (color === "glas") pic = "shelfs_glas.avif";

  }

  createValidationEntry(sP.checkTxts, {
    title: "Hyllplan",
    text,
    level: "info",
    pic,
    rows,
    headers,
    message:
      helpMessages.shelfColor
  });
}