import { createValidationEntry } from '../helper/validationResultFactory.js';
import { prepareHeaders } from './common/prepareHeaders.js';
import { cabinetInfoRow } from './common/cabinetRows.js';
import { helpMessages } from './helper/helpMessages.js';
import { GLASS_STATUS } from '../logic/glassCompare.js';

export function glassCompareTxt(sP, result) {

  // -----------------------------------
  // TEXT SOM VISAS (GLOBAL STATUS)
  // -----------------------------------
  const globalLabels = {
    [GLASS_STATUS.ALL]: "🟩 Alla",
    [GLASS_STATUS.NONE]: "🟢 Nej",
    [GLASS_STATUS.ONLY_HIGH]: "🟢 Alla höga",
    [GLASS_STATUS.SOME]: "🟧 En eller flera",
    [GLASS_STATUS.DEPTH_ERROR]: "🟥 ⚠️ Fel djup/antal ⚠️"
  };

  // -----------------------------------
  // TEXT SOM VISAS (INDIVIDUELL RAD)
  // -----------------------------------
  const individualLabels = {
    ...globalLabels,
    [GLASS_STATUS.NONE]: "🟠 Nej"
  };

  const warningLabels = {
    [GLASS_STATUS.HIGH_MISSING]: "Hög saknas",
    [GLASS_STATUS.MEDIUM_MISSING]: "Medel saknas"
  };

  // -----------------------------------
  // INGA LÅDOR
  // -----------------------------------
  const prepared = prepareHeaders(result, {
      sP,
      title: "Glassidor",
      pic: "add_on_sides.avif",
      message: "Inga stommar innehåller lådor som kan ha glassidor."
    });

    if (!prepared) return;

    const { validHeaders, headers } = prepared;
  // -----------------------------------
  // HJÄLPFUNKTION
  // -----------------------------------
  const buildTypeText = (storlekar, type) => {
    if (!storlekar) return "";

    const parts = [];

    Object.entries(storlekar || {}).forEach(([key, val]) => {
      const [depth, height] = key.split("-");
      const count = type === "lador" ? val.lador : val.glassidor;

      if (count > 0) {
        parts.push(`${depth} ${height} (${count} st)`);
      }
    });

    return parts.join("\n");
  };

  // -----------------------------------
  // STATUS RAD (Använder individualLabels)
  // -----------------------------------
  const statusRow = {
    color: "Status\nGlassidor/låda",
    numbers: validHeaders.map(h => individualLabels[h.result] || "")
  };

  // -----------------------------------
  // HIGH MISSING RAD
  // -----------------------------------
  const highMissingRow = {
    color: warningLabels[GLASS_STATUS.HIGH_MISSING],
    numbers: validHeaders.map(h =>
      Array.isArray(h.details) && h.details.includes(GLASS_STATUS.HIGH_MISSING)
        ? "🔴"
        : ""
    )
  };

  // -----------------------------------
  // MEDIUM MISSING RAD
  // -----------------------------------
  const mediumMissingRow = {
    color: warningLabels[GLASS_STATUS.MEDIUM_MISSING],
    numbers: validHeaders.map(h =>
      Array.isArray(h.details) && h.details.includes(GLASS_STATUS.MEDIUM_MISSING)
        ? "🔴"
        : ""
    )
  };

  // -----------------------------------
  // LÅDOR RAD
  // -----------------------------------
  const drawersRow = {
    color: "Lådor \n Djup x höjd",
    numbers: validHeaders.map(h =>
      buildTypeText(
        sP.orders?.find(o => String(o.id) === String(h.header))?.storlekar ?? {},
        "lador"
      )
    )
  };

  // -----------------------------------
  // GLASSIDOR RAD
  // -----------------------------------
  const glassRow = {
    color: "Glassidor \n Djup x höjd",
    numbers: validHeaders.map(h =>
      buildTypeText(
        sP.orders?.find(o => String(o.id) === String(h.header))?.storlekar || {},
        "glassidor"
      )
    )
  };

  const cabRow = cabinetInfoRow(validHeaders);

  // -----------------------------------
  // ALLA RADER
  // -----------------------------------
  const rows = [
    cabRow,
    statusRow,
    drawersRow,
    glassRow,
    highMissingRow,
    mediumMissingRow
  ];

  // -----------------------------------
  // SKRIV UT
  // -----------------------------------
  createValidationEntry(sP.checkTxts, {
    title: "Glassidor",
    text: globalLabels[result.total] || "", // Global status använder grön cirkel för Nej
    level: "info",
    pic: "add_on_sides.avif",
    rows: rows,
    headers: [...headers],
    message:
      helpMessages.glassCompare
  });

}