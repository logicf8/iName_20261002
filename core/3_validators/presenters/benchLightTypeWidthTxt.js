import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';

export function benchLightTypeWidthTxt(sP, result) {

  const prepared = prepareHeaders(result, {
        sP,
        title: "Bänkbelysning",
        pic: "bench_lights_mixed.png",
        message: "Inga väggskåp hittades."
      });

      if (!prepared) return;

      const { validHeaders, headers } = prepared;

  const rows = [
    cabinetInfoRow(validHeaders),
    {
      color: "Status\nBänkbelysning",
      numbers: validHeaders.map(h => {

        switch (h.status) {
          case "correct": return "✅";
          case "missing": return "❌";
          case "wrong width": return "🟥 ⚠️ Fel bredd ⚠️";
          case "wrong quantity": return "🟥 ⚠️ Fel antal ⚠️";
          default: return "-";
        }
      })
    },
    {
      color: "Artiklar",
      numbers: validHeaders.map(h => {

        if (h.articles.length === 0) {
          return "-";
        }

        if (h.articles.length === 1) {
          const a = h.articles[0];

          if (a.quantity > 1) {
            return `${a.name} ${a.color}\n ${a.width} cm (${a.quantity} st)`;
          }

          return `${a.name} ${a.color}\n ${a.width} cm`;
        }

        // FLERA artiklar
        return h.articles.map(a => {

          if (a.quantity > 1) {
            return `${a.name} ${a.color} ${a.width} cm (${a.quantity} st)`;
          }

          return `${a.name} ${a.color} ${a.width} cm`;

        }).join("\n");

      })
    },
    {
      color: "Total Watt",
      numbers: validHeaders.map(h => {

        if (h.articles.length === 0) {
          return "-";
        }

        let totalWatt = 0;

        h.articles.forEach(a => {

          if (!a.watt || a.watt === "N/A") {
            return;
          }

          const wattValue = parseFloat(
            String(a.watt).replace(",", ".")
          );

          if (!isNaN(wattValue)) {
            totalWatt += wattValue * (a.quantity || 1);
          }

        });

        if (totalWatt === 0) {
          return "-";
        }

      return `${String(totalWatt).replace(".", ",")} W`;

      })
    },
  ];

  createValidationEntry(sP.checkTxts, {
    title: "Bänkbelysning",
    text: result.orderStatus,
    level: "info",
    pic: result.pic,
    rows,
    headers,
    message:
      helpMessages.benchLight
  });
}