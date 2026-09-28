import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';

export function innerHeightTxt(sP, result) {
  const prepared = prepareHeaders(result, {
        sP,
        title: "Inre mått",
        pic: "inner_dimensions.png",
        message: "Inga stommar hittades."
      });

    if (!prepared) return;

    const { validHeaders, headers } = prepared;

  const rows = [
    cabinetInfoRow(validHeaders),
    {
      color: "Beräknad höjd",
      numbers: validHeaders.map(h => `${h.calculatedHeight}`)
    },
    {
      color: "Höjd",
      numbers: validHeaders.map(h => h.heightOk ? "✅" : "❌")
    },
    {
      color: "Bredd",
      numbers: validHeaders.map(h => h.widthOk ? "✅" : "❌")
    },
    {
      color: "Djup",
      numbers: validHeaders.map(h => {
        if (!h.depthOk) return "⚠️ Fel djup ⚠️";       // riktigt fel (för djup)
        if (h.depthLess) return "⚠️ Grundare låda ⚠️";     // ny status (för grund)
        return "✅";
      })
    },
    {
      color: "Artiklar",
      numbers: validHeaders.map(h => {

        const grouped = {};

        h.articles
          .filter(a => a.innerHeightAffecting)
          .forEach(a => {
            const key = a.description || "Ingen beskrivning";
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(a);
          });

        return Object.entries(grouped).map(([desc, articles]) => {
          const lines = articles.map(a =>
            `${a.width}×${a.depth}×(${a.height}) (${a.quantity}st)`
          );
          return `${desc}\n${lines.join("\n")}`;
        }).join("\n");

      })
    },
    {
      color: "Ej höjdpåverkande",
      numbers: validHeaders.map(h => {

        const grouped = {};

        h.articles
          .filter(a => !a.innerHeightAffecting)
          .forEach(a => {
            const key = a.description || "Ingen beskrivning";

            if (!grouped[key]) {
              grouped[key] = 0;
            }

            grouped[key] += Number(a.quantity) || 1;
          });

        const entries = Object.entries(grouped);

        if (entries.length === 0) return "-";

        return entries
          .map(([desc, qty]) => `${desc} (${qty}st)`)
          .join("\n");

      })
    }
  ];

  // -----------------------------
  // STATUSLOGIK (uppdaterad)
  // -----------------------------
  const hasWidthError = result.headers.some(h => !h.widthOk);
  const hasHeightError = result.headers.some(h => !h.heightOk);
  const hasDepthError = result.headers.some(h => !h.depthOk);
  const hasDepthLess = result.headers.some(h => h.depthLess);

  let text = "";

  if (!hasWidthError && !hasHeightError && !hasDepthError && !hasDepthLess) {
    text = "🟩 Inget uppenbart fel";
  } else {
    const errors = [];

    if (hasWidthError) errors.push("🟥 ⚠️ Fel bredd ⚠️");
    if (hasHeightError) errors.push("🟥 ⚠️ Fel höjd ⚠️");
    if (hasDepthError) errors.push("🟥 ⚠️ Fel djup ⚠️");

    // NY: separat varning för depthLess
    if (hasDepthLess && !hasDepthError) {
      errors.push("🟧 ⚠️ Grundare låda ⚠️");
    }

    text = errors.join(" & ");
  }

  createValidationEntry(sP.checkTxts, {
    title: "Inre mått",
    text,
    level: "info",
    pic: "inner_dimensions.png",
    rows,
    headers,
    message:
      helpMessages.innerDimensions
  });
}
