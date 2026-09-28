import { filter } from "../../shared/global/myConstants.js";

export function cabColors(sectionPortfolio) {

  const cabinetGroup = filter.Cabinet.group1;

  const colorMap = {};

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name === "CombinationHeader") {

      header.returnArticles().forEach(article => {

        if (article.group1 === cabinetGroup) {

          const color = article.color;

          if (!colorMap[color]) {
            colorMap[color] = {
              color,
              headers: new Set()
            };
          }

          colorMap[color].headers.add(header.number);
        }
      });
    }
  });

  const keys = Object.keys(colorMap);

  if (keys.length === 0) {
    return {
      status: "⬛",
      sameColor: true,
      colors: {},
      pic: "cabinets_mixed.png"
    };
  }

  const sameColor = keys.length === 1;

  const status = sameColor ? "🟩" : "🟥";

  let pic = "cabinets_mixed.png";

  if (sameColor) {
    if (keys[0] === "vit") pic = "cabinet_white.avif";
    else if (keys[0] === "svartgrå") pic = "cabinet_black.avif";
  }

  const finalColorMap = {};
  keys.forEach(color => {
    finalColorMap[color] = {
      color,
      numbers: Array.from(colorMap[color].headers)
    };
  });

  return {
    status,
    sameColor,
    colors: finalColorMap,
    pic
  };
}