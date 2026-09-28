import { filter } from "../../shared/global/myConstants.js";

export function drawerColors(sectionPortfolio) {

  const interiorGroup = filter.Interior.group1;
  const drawerType = filter.Interior.group3.Drawer;
  const pullOutType = filter.Interior.group3.PullOut;

  const colorMap = {};

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name === "CombinationHeader") {

      header.returnArticles().forEach(article => {

        const isInterior = article.group1 === interiorGroup;
        const isDrawerOrPullOut =
          article.group3 === drawerType ||
          article.group3 === pullOutType;

        if (isInterior && isDrawerOrPullOut) {

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

  // 🟩 INGA LÅDOR = OK
  if (keys.length === 0) {
    return {
      status: "⬛",
      sameColor: true,
      colors: {},
      pic: "drawer_mixed.png"
    };
  }

  const sameColor = keys.length === 1;
  const status = sameColor ? "🟩" : "🟥";

  let pic = "drawer_mixed.png";

  if (sameColor) {
    if (keys[0] === "vit") pic = "drawer_white.avif";
    else if (keys[0] === "mörkgrå") pic = "drawer_black.avif";
  }

  // 🔄 Set → Array
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