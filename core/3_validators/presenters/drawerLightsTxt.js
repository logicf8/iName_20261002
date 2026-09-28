import { createValidationEntry } from '../helper/validationResultFactory.js';
import { helpMessages } from './helper/helpMessages.js';
import { DRAWER_LIGHT_STATUS } from "../logic/drawerLights.js";
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';

export function drawerLightsTxt(sP, result) {
  // -----------------------------
  // GLOBAL STATUS (överst)
  // -----------------------------
  const globalLabels = {
    [DRAWER_LIGHT_STATUS.ALL]: "🟩 Alla",
    [DRAWER_LIGHT_STATUS.NONE]: "🟢 Nej",
    [DRAWER_LIGHT_STATUS.SOME]: "🟧 En eller flera",
    [DRAWER_LIGHT_STATUS.DEPTH_ERROR]: "🟥 ⚠️ Fel bredd/antal ⚠️"
  };

  // -----------------------------
  // INDIVIDUELL STATUS (rad)
  // -----------------------------
  const individualLabels = {
    ...globalLabels,
    [DRAWER_LIGHT_STATUS.NONE]: "🟠 Nej"
  };

  const status = result.overallResult || result.result; // fallback om enskild header
  const statusText =  globalLabels[status];

  const prepared = prepareHeaders(result, {
        sP,
        title: "Lådbelysning",
        pic: "drawer_lights.avif",
        rows: [{ color: "Status", numbers: ["Inga lådor"] }],
        message: "Inga stommar innehåller lådor"
      });

      if (!prepared) return;

      const { validHeaders, headers } = prepared;

  // -----------------------------
  // Skapa rader för tabellen
  // -----------------------------
  const rows = [
    cabinetInfoRow(validHeaders),
    {
      color: "Status\nLådbelysning",
      numbers:validHeaders.map(h => individualLabels[h.result] || "")
    },
    {
      color: "Lådbelysning",
      numbers: validHeaders.map(
        h => `${h.totalLights ?? 0} av ${h.totalDrawers ?? 0} lådor`
      )
    },
    {
      color: "Total Watt",
      numbers: validHeaders.map(h => {

        if (!h.totalWatt || h.totalWatt === 0) {
          return "-";
        }

        return `${String(h.totalWatt).replace(".", ",")} W`;

      })
    }
  ];

  // -----------------------------
  // Skapa utskrift
  // -----------------------------
  createValidationEntry(sP.checkTxts, {
    title: "Lådbelysning",
    text: statusText,
    level: "info",
    pic: "drawer_lights.avif",
    rows: rows,
    headers: [...headers],
    message:
      helpMessages.drawerLights
  });
}