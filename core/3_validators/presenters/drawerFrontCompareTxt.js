import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';

export function drawerFrontCompareTxt(sP, result) {

  const prepared = prepareHeaders(result, {
        sP,
        title: "Lådfronter & lådor",
        pic: "frontAndDrawersMatch.png",
        message: "Inga lådor eller lådfronter hittades."
      });

      if (!prepared) return;

      const { validHeaders, headers } = prepared;
  // -------------------------
  // HELPERS
  // -------------------------
  const shortName = (name) => {
    if (name === "MAXIMERA") return "MA";
    if (name === "KNIVSHULT") return "KN";
    return name;
  };

  const rows = [
    cabinetInfoRow(validHeaders),    
    // -------------------------
    // STATUS
    // -------------------------
    {
      color: "Status\nLådfront/låda",
      numbers: validHeaders.map(h =>
        (h.status === "OK" && h.result === 0) ? "✅" : "❌"
      )
    },
    // -------------------------
    // LÅDOR
    // -------------------------
    {
      color: "Lådor",
      numbers: validHeaders.map(h => {

        const groups = {};

        h.drawerItems.forEach(d => {
          const key = `${shortName(d.name)} ${d.group3}`;
          if (!groups[key]) groups[key] = [];
          groups[key].push(d);
        });

        return Object.entries(groups).map(([title, items]) => {

        const rows = items.map(i => {

          // ✅ PULLOUT
          if (i.isPullOut) {
            return `${i.width} (${i.quantity} st)`;
          }

          // ✅ VANLIG LÅDA
          return `${i.width}x${i.depth}-${i.level} (${i.quantity} st)`;

        }).join("\n");

          return `${title}\n${rows}`;

        }).join("\n\n");

      })
    },

    // -------------------------
    // YTTRE FRONT
    // -------------------------
    {
      color: "Yttre front",
      numbers: validHeaders.map(h => {

        const groups = {};

        h.outerItems.forEach(o => {
          const key = o.group2;
          if (!groups[key]) groups[key] = [];
          groups[key].push(o);
        });

        return Object.entries(groups).map(([title, items]) => {

          const rows = items.map(i =>
            `${i.width}x${i.height} (${i.quantity} st)`
          ).join("\n");

          return `${title}\n${rows}`;

        }).join("\n\n");

      })
    },

    // -------------------------
    // INRE FRONT
    // -------------------------
    {
      color: "Inre front",
      numbers: validHeaders.map(h => {

        const groups = {};

        h.innerItems.forEach(i => {
          const key = i.name;
          if (!groups[key]) groups[key] = [];
          groups[key].push(i);
        });

        return Object.entries(groups).map(([title, items]) => {

          const rows = items.map(i =>
            `${i.width}-${i.level} (${i.quantity} st)`
          ).join("\n");

          return `${title}\n${rows}`;

        }).join("\n\n");

      })
    },

    {
      color: "Korrigerade artiklar",
      numbers: validHeaders.map(h =>
        (h.correctionItems && h.correctionItems.length > 0)
          ? h.correctionItems.map(c => c.text).join("\n")
          : ""
      )
    },

    // -------------------------
    // MATCHNING
    // -------------------------
    {
      color: "Matchning",
      numbers: validHeaders.map(h => {

        return (h.matchItems || []).map(m => {

          const d = m.drawer;
          const qty = m.quantity;

          if (m.type === "inner") {
            return `[${shortName(d.name)} ${d.width}-${d.level} (${qty}) ↔ IF ${m.front.width}-${m.front.level} (${qty})]`;
          }

          if (m.type === "outer") {
            return `[${shortName(d.name)} ${d.width}-${d.level} (${qty}) ↔ YF ${m.front.width}x${m.front.height} (${qty})]`;
          }

          return "";

        }).join("\n");

      })
    },

    // -------------------------
    // COUNT
    // -------------------------
    {
      color: "Antal lådor",
      numbers: validHeaders.map(h => `${h.drawerCount}`)
    },
    {
      color: "Antal yttre",
      numbers: validHeaders.map(h => `${h.outerCount}`)
    },
    {
      color: "Antal inre",
      numbers: validHeaders.map(h => `${h.innerCount}`)
    },
    {
      color: "Antal korrigering",
      numbers: validHeaders.map(h =>
        h.correctionCount ? `-${h.correctionCount}` : "0"
      )
    },
    {
      color: "Resultat",
      numbers: validHeaders.map(h => `${h.result}`)
    },
    {
      color: "Status\nLådfront/låda",
      numbers: validHeaders.map(h =>
        (h.status === "OK" && h.result === 0) ? "✅" : "❌"
      )
    },
  ];

  let text = "🟩 Inget uppenbart fel";

  if (result.globalStatus === "COUNT") text = "🟥 ⚠️ Fel antal ⚠️";
  else if (result.globalStatus === "FRONT") text = "🟥 ⚠️ Fel lådfront ⚠️";

  createValidationEntry(sP.checkTxts, {
    title: "Lådfronter & lådor",
    text,
    level: "info",
    rows,
    headers,
    pic: "frontAndDrawersMatch.png",
    message:       
      helpMessages.drawerFrontsMatch
  });
}