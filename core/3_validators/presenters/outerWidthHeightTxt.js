import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';

export function outerWidthHeightTxt(sP, result) {
  const prepared = prepareHeaders(result, {
        sP,
        title: "Yttre mått",
        pic: "outher_dimensions.png",
        message: "Inga stommar hittades."
      });

    if (!prepared) return;

    const { validHeaders, headers } = prepared;

  // -----------------------------
  // Bygg rader för tabellen
  // -----------------------------
  const rows = [
    {
      color: "Stomme",
      numbers: validHeaders.map(h => `${h.type}\n${h.width} × ${h.depth} x ${h.height}`)
    },
    {
      color: "Beräknad höjd",
      numbers: validHeaders.map(h => `${h.calculatedHeight}`)
    },
    {
      color: "Totalhöjd",
      numbers: validHeaders.map(h => h.heightOk ? "✅" : "❌")
    },
    {
      color: "Bredd",
      numbers: validHeaders.map(h => h.widthOk ? "✅" : "❌")
    },
    {
      color: "Artiklar",
      numbers: validHeaders.map(h => {

      const grouped = {};

      (h.articles || []).forEach(a => {
        if (!grouped[a.group2]) {
          grouped[a.group2] = [];
        }
        grouped[a.group2].push(a);
      });

        // Bygg text
        return Object.entries(grouped).map(([groupName, articles]) => {

          const header = groupName;

          const lines = articles.map(a => {
            if (a.calcHeight === 0) {
              return `${a.name}`;
            }
            return `${a.width}×${a.height} (${a.quantity}st)`;
          });

          return `${header}\n${lines.join("\n")}`;

        }).join("\n");
      })    
    }
  ];

  const hasWidthError = result.headers.some(h => !h.widthOk);
  const hasHeightError = result.headers.some(h => !h.heightOk);

  let text = "";

  if (!hasWidthError && !hasHeightError) {
    text = "🟩 Inget uppenbart fel";
  } else {
    const errors = [];
    if (hasWidthError) errors.push("🟥 ⚠️ Fel bredd ⚠️");
    if (hasHeightError) errors.push("🟥 ⚠️ Fel höjd ⚠️");

    text = errors.join(" & ");
  }

  // -----------------------------
  // Skapa utskrift
  // -----------------------------
  if (typeof createValidationEntry === "function") {
    createValidationEntry(sP.checkTxts, {
      title: "Yttre mått",
      text: text,
      level: "info",
      pic: "outher_dimensions.png",
      rows: rows,
      headers: headers,
      message:
        helpMessages.outerDimensions
    });
  }
}