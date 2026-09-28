import { filter } from "../../shared/global/myConstants.js";

export function familyTypes(sectionPortfolio) {

  const frontGroup = filter.Fronts.group1;
  const validGroup2Values = Object.values(filter.Fronts.group2);

  const colorMap = {};

  sectionPortfolio.returnHeaders().forEach(header => {

    if (
      header.constructor.name !== "CoverPanelHeader" &&
      header.constructor.name !== "OpenHeader"
    ) {

      header.returnArticles().forEach(article => {

        const isFrontGroup = article.group1 === frontGroup;
        const isValidGroup2 = validGroup2Values.includes(article.group2);

        if (isFrontGroup && isValidGroup2) {

          const key = `${article.name} ${article.color}`;

          if (!colorMap[key]) {
            colorMap[key] = {
              name: article.name,
              color: article.color,
              headers: new Set()
            };
          }

          let headerId;
          if (header.constructor.name === "SecondStageHeader") {
            headerId =
              header.originalTxt === "Ben och socklar"
                ? "Socklar"
                : header.originalTxt;
          } else {
            headerId = header.number;
          }

          colorMap[key].headers.add(headerId);
        }
      });
    }
  });

  const keys = Object.keys(colorMap);

  // 🟩 INGA ARTIKLAR = OK
  if (keys.length === 0) {
    return {
      status: "⬛",
      colors: {},
      sameColor: true
    };
  }

  const parsed = Object.values(colorMap);

  const uniqueColors = [...new Set(parsed.map(p => p.color))];
  const hasForbattra = parsed.some(p => p.name === "FÖRBÄTTRA");

  const sameColor = keys.length === 1;


  let status = "🟥"; // default = RÖD

  // Kollar kombination 1: "matt yta antracit" + "svart"
  const isAntracitSvart = 
    uniqueColors.includes("matt yta antracit") && 
    uniqueColors.includes("svart");

  // Kollar kombination 2: "vit trämönstrad" + "vit"
  const isVitTraVit = 
    uniqueColors.includes("vit trämönstrad") && 
    uniqueColors.includes("vit");

  const hasApprovedCombo =
    hasForbattra &&
    uniqueColors.length === 2 &&
    (isAntracitSvart || isVitTraVit);

  if (hasApprovedCombo) {
    status = "🟨";
  }
  else if (
    keys.length === 1 ||
    (keys.length === 2 && hasForbattra && uniqueColors.length === 1)
  ) {
    status = "🟩";
  }

  const finalColorMap = {};
  keys.forEach(key => {
    finalColorMap[key] = {
      name: colorMap[key].name,
      color: colorMap[key].color,
      numbers: Array.from(colorMap[key].headers)
    };
  });

  return {
    status,
    sameColor,
    colors: finalColorMap
  };
}