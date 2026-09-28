import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';

export function spotLightCheckTxt(sP, result) {

  const prepared = prepareHeaders(result, {
        sP,
        title: "Spot",
        pic: "mittled_spot_mixed.png",
        message: "Inga väggskåp hittades."
      });

    if (!prepared) return;

    const { validHeaders, headers } = prepared;

const rows = [
  cabinetInfoRow(validHeaders),

  {
    color: "Status\nSpottar",
    numbers: validHeaders.map(h => h.status)
  },

  {
    color: "Artiklar",
    numbers: validHeaders.map(h =>
      h.spotArticles.map(a =>
        `${a.name} ${a.color} (${a.quantity} st)`
      ).join("\n")
    )
  },

  {
    color: "Total Watt",
    numbers: validHeaders.map(h => {

      if (!h.spotArticles.length) {
        return "-";
      }

      let totalWatt = 0;

      h.spotArticles.forEach(a => {

        if (!a.watt || a.watt === "N/A") {
          return;
        }

        // 🔹 Klarar 4W / 4.5W / 4,5W
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
  }
];

  let text = result.orderStatus;

  createValidationEntry(sP.checkTxts, {
    title: "Spot",
    text: text,
    level: "info",
    pic: result.pic || "mittled_spot_mixed.png",
    rows: rows,
    headers: headers,
    message:
      helpMessages.spotLight
      });
    }
