import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';

export function hingeCompareTxt(sP, result) {

  const prepared = prepareHeaders(result, {
        sP,
        title: "Gångjärn",
        pic: "hinges.avif",
        message: "Inga dörrar hittades."
      });

      if (!prepared) return;

      const { validHeaders, headers } = prepared;

  const rows = [
    cabinetInfoRow(validHeaders),
    {
      color: "Status\nGångjärn/dörr",
      numbers: validHeaders.map(h => {
        if (h.status === "OK") return "✅";
        if (h.status === "LOW") return "❌";
        return "✅ ✚ ❗";
      })
    },
    {
      color: "Behöver gångjärn",
      numbers: validHeaders.map(h =>
        h.doorRows.length
          ? h.doorRows.map(d => d.text).join("\n")
          : ""
      )
    },
    {
      color: "Hittade påsar",
      numbers: validHeaders.map(h =>
        h.hingeRows.length
          ? `Gångjärn\n${h.hingeRows.map(d => d.text).join("\n")}`
          : ""
      )
    },
    {
      color: "Hittat antal",
      numbers: validHeaders.map(h => `${h.foundHinges}`)
    },
    {
      color: "Behov antal",
      numbers: validHeaders.map(h => `${h.neededHinges}`)
    },
    {
      color: "Diff + / -",
      numbers: validHeaders.map(h => `${h.diff}`)
    },
    {
      color: "Status\nGångjärn/dörr",
      numbers: validHeaders.map(h => {
        if (h.status === "OK") return "✅";
        if (h.status === "LOW") return "❌";
        return "✅ ✚ ❗";
      })
    },
  ];

  let text = "🟩 Inget uppenbart fel";

  if (result.globalStatus === "MISSING") {
    text = "🟥 ⚠️ Gångjärn saknas ⚠️";
  } else if (result.globalStatus === "EXTRA") {
    text = "🟩 ⚠️ Extra gångjärn ⚠️";
  }
 
  createValidationEntry(sP.checkTxts, {
    title: "Gångjärn",
    text,
    level: "info",
    pic: "hinges.avif",
    rows,
    headers,
    message:
      helpMessages.hingeCompare
  });
}