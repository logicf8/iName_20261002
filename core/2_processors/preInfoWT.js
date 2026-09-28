//C:\PRIVAT\MinaProgram\iName\ValueModifiers\preInfoWT.js
export function checkMaterialsAntQuantity(header) {
  const articles = header.returnArticles();


  //OBS! .color är i denna fil innehåller info om material

  // -----------------------------
  // 1. Filtrera Måttbeställt (ej Operation)
  // -----------------------------
  const customArticles = articles.filter(
    a => a.group1 === "Måttbeställt" && a.group3 !== "Operation"
  );

  const count = customArticles.length;

  const allSame = (arr, key) =>
    arr.every(item => item[key] === arr[0]?.[key]);

  const colors = customArticles.map(a => a.color);

  const simpleMaterials = ["laminat", "faner"];
  const compositeMaterials = [
    "kvartskomposit",
    "glaskomposit",
    "högtrycks porslin"
  ];

  const prioritizedCustomArticle =
    customArticles.find(a => simpleMaterials.includes(a.color)) ||
    customArticles[0] ||
    null;

  const onlySimple =
    colors.length > 0 &&
    colors.every(c => simpleMaterials.includes(c));

  const onlyComposite =
    colors.length > 0 &&
    colors.every(c => compositeMaterials.includes(c));

  const hasSimple = colors.some(c => simpleMaterials.includes(c));
  const hasComposite = colors.some(c => compositeMaterials.includes(c));

  // -----------------------------
  // 2. Statuslogik
  // -----------------------------
  let stats = 0;
  let message = "";

  if (
    count > 0 &&
    allSame(customArticles, "name") &&
    allSame(customArticles, "description") &&
    allSame(customArticles, "color")
  ) {
    stats = 1;
    message = "Alla artiklar har samma namn, beskrivning och material.";
  } else if (count > 0 && allSame(customArticles, "color")) {
    stats = 2;
    message = "Alla artiklar har samma material.";
  } else if (onlySimple) {
    stats = 3;
    message = "Endast laminat eller faner.";
  } else if (onlyComposite) {
    stats = 4;
    message = "Endast kompositmaterial.";
  } else if (hasSimple && hasComposite) {
    stats = 5;
    message = "Både enkla material och kompositmaterial förekommer.";
  }

  // -----------------------------
  // 3. Filtrera Färdiglängd (ej Tillbehör)
  // -----------------------------
  const preCut = articles.filter(
    a => a.group1 === "Färdiglängd" && a.group3 !== "Tillbehör"
  ).length;

  // -----------------------------
  // 4. Filtrera Underlimmad / Operation
  // -----------------------------
  const undergluedArticleNumbers = [
    "604.969.17",
    "005.557.78",
    "303.453.12",
    "204.978.72",
    "406.077.56"
  ];

  const underglued = articles.filter(
    a =>
      a.group1 === "Måttbeställt" &&
      a.group3 === "Operation" &&
      undergluedArticleNumbers.includes(a.artNr)
  );

  // -----------------------------
  // 5. Return
  // -----------------------------
  return {
    stats,
    message,
    count,
    preCut,
    firstCustomArticle: prioritizedCustomArticle,
    underglued
  };
}
