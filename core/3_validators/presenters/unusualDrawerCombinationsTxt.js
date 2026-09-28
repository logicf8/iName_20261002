import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';
import { createEmptyState } from './common/emptyState.js';

export function unusualDrawerCombinationsTxt(sP, result) {

  if (!result || !Array.isArray(result.headers)) return;

  if (result.headers.length === 0) {
    createEmptyState({
      sP,
      title: "Ovanliga lådkombinationer",
      pic: "unDrawCombos.png",
      message: "Inga stommar med lådor hittades."
    });
    return;
  }

  const headers = result.headers.map(h => String(h.header));

  const rows = [
    cabinetInfoRow(result.headers),
    {
      color: "Status\nLådkombination",
      numbers: result.headers.map(h => h.status)
    },

    {
      color: "Påverkande artiklar",
      numbers: result.headers.map(h => {

        // 1) HINGE HAR HÖGST PRIORITET
        if (h.ruleTriggers?.includes("153°")) {
          const articles = h.hingeArticles;
          if (!articles || articles.length === 0) return "-";

          return articles.map(a => {
            const qty = Number(a.quantity) || 1;
            return `${a.description} (${qty} st)`;
          }).join("\n");
        }

        // 2) HOB FAN
        if (h.ruleTriggers?.includes("Häll med fläkt")) {
          return "Häll med fläkt";
        }

        // 3) HOB
        if (h.ruleTriggers?.includes("Häll")) {
          return "Häll";
        }

        // 4) SINK
        if (h.ruleTriggers?.includes("Diskho")) {
          return "Diskho";
        }

        // fallback (om inget matchar)
        return "-";
      })
    },

    {
      color: "Lådor",
      numbers: result.headers.map(h => {
        return h.drawerArticles.map(a => {
          const qty = Number(a.quantity) || 1;
          return `${a.width}x${a.depth}-${a.group4} (${qty} st)`;
        }).join("\n");
      })
    },
    {
      color: "Lådfronter",
      numbers: result.headers.map(h => {
        return h.drawerFronts.map(a => {
          const qty = Number(a.quantity) || 1;
          return `${a.width}x${a.height} (${qty} st)`;
        }).join("\n");
      })
    }
  ];

  const hasError = result.headers.some(h => h.status === "❌");

  let text = "🟩 Inget uppenbart fel";
  if (hasError) text = "🟥 ⚠️ Ovanligt ⚠️";

  createValidationEntry(sP.checkTxts, {
    title: "Ovanliga lådkombinationer",
    text,
    level: "info",
    rows,
    headers,
    pic: "unDrawCombos.png", 
    message:
      helpMessages.unusualDrawerCombos
  });
}