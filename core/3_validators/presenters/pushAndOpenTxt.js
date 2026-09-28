import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';
import { PNO_STATUS } from "../logic/pushAndOpen.js";

export function pushAndOpenTxt(sP, result) {
  // -----------------------------
  // GLOBAL STATUS
  // -----------------------------
  const globalLabels = {
    [PNO_STATUS.ALL]: "🟩 Alla",
    [PNO_STATUS.NONE]: "🟢 Nej",
    [PNO_STATUS.SOME]: "🟧 En eller flera",
    [PNO_STATUS.DEPTH_ERROR]: "🟥 ⚠️ Fel djup/antal ⚠️",
    [PNO_STATUS.SAME_AS_OUTER]: "🟢 Antal = Yttre lådfronter"
  };

  // -----------------------------
  // INDIVIDUELL STATUS (radnivå)
  // -----------------------------
  const individualLabels = {
    ...globalLabels,
    [PNO_STATUS.NONE]: "🟠 Nej"
  };

  const status = result.overallResult || result.result;
  const statusText = globalLabels[status];

  const prepared = prepareHeaders(result, {
        sP,
        title: "Tryck & öppna",
        pic: "push_and_open.avif",
        message: "Inga stommar innehåller Knivshult- lådor."
      });

      if (!prepared) return;

      const { validHeaders, headers } = prepared;

  // -----------------------------
  // Helper: skapa text per djup
  // -----------------------------
  const buildPnOText = (order, type) => {
    if (!order) return "";

    const depthMap = {};

    const addToMap = (depth, qty) => {
      if (!depth) return;
      if (!depthMap[depth]) depthMap[depth] = 0;
      depthMap[depth] += qty;
    };

    if (type === "drawers") {
      // Lådor: visa verkliga djup
      (order.drawers37 || []).forEach(d => addToMap(37, d.quantity));
      (order.drawers45n60 || []).forEach(d => {
        const depth = Number(d.article.depth);
        addToMap(depth, d.quantity);
      });
    }

    if (type === "pno") {
      // Tryck & öppna: visa 37 eller 45/60
      let qty37 = 0;
      let qty45n60 = 0;

      order.pushAndOpen37.forEach(p => { qty37 += p.quantity; });
      order.pushAndOpen45n60.forEach(p => { qty45n60 += p.quantity; });

      if (qty37 > 0) addToMap("37", qty37);
      if (qty45n60 > 0) addToMap("45/60", qty45n60);
    }

    return Object.entries(depthMap)
      .sort((a, b) => {
        if (a[0] === "45/60") return 1;
        if (b[0] === "45/60") return -1;
        return Number(a[0]) - Number(b[0]);
      })
      .map(([depth, count]) => `${depth} (${count} st)`)
      .join("\n");
  };

  // -----------------------------
  // Mappa orders för enkel åtkomst
  // -----------------------------
  const orderMap = Object.fromEntries(
    (sP.pnoOrders || []).map(o => [String(o.id), o])
  );

  // -----------------------------
  // Skapa rader för tabellen
  // -----------------------------
  const rows = [

    cabinetInfoRow(validHeaders),

    {
      color: "Status\nT&Ö / låda",
      numbers: validHeaders.map(h => individualLabels[h.result] || "")
    },
    {
      color: "Tryck & öppna",   // Den gamla kvot-raden
      numbers: validHeaders.map(
        h => `${h.totalPnO ?? 0} av ${h.totalDrawers ?? 0} lådor`
      )
    },
    {
      color: "Yttre lådfronter",
      numbers: validHeaders.map(h => `${h.totalOuterFronts ?? 0} st`)
    },
    {
      color: "Lådor per djup",
      numbers: validHeaders.map(h =>
        buildPnOText(orderMap[String(h.header)], "drawers")
      )
    },
    {
      color: "Tryck & öppna per djup",
      numbers: validHeaders.map(h =>
        buildPnOText(orderMap[String(h.header)], "pno")
      )
    }
  ];

  // -----------------------------
  // Skapa utskrift
  // -----------------------------
  createValidationEntry(sP.checkTxts, {
    title: "Tryck & öppna",
    text: statusText,
    level: "info",
    pic: "push_and_open.avif",
    rows: rows,
    headers: [...headers],
    message:
      helpMessages.pushAndOpen
  });
}