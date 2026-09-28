//core\4_generators\reportGenerator\aggregators\aggregateArticleStats.js
import {
  GROUP1,
  FRONT_GROUPS,
  APPLIANCE_GROUPS
} from "../constants/reportGroups.js";

export function aggregateArticleStats(sectionPortfolio) {
  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name === "CoverPanelHeader") {
      return;
    }

    header.returnArticles().forEach(article => {

      switch (article.group1) {

        case GROUP1.CABINET:
        case GROUP1.OPENCAB: {
          sectionPortfolio.countArtFlag.cabinets += article.quantity;
          sectionPortfolio.priceFlag.pCabinets += article.totPrice;
          break;
        }

        case GROUP1.APPLIANCE: {
          if (article.group2 !== APPLIANCE_GROUPS.ACCESSORIES) {
            sectionPortfolio.countArtFlag.appliance += article.quantity;
            sectionPortfolio.priceFlag.pAppliances += article.totPrice;
          }
          break;
        }

        case GROUP1.FRONT: {
          if (Object.values(FRONT_GROUPS).includes(article.group2)) {

            if (article.height === 10) {
              sectionPortfolio.countArtFlag.fronts += (article.quantity * 2);
            }
            else {
              sectionPortfolio.countArtFlag.fronts += article.quantity;
            }

            sectionPortfolio.priceFlag.pFronts += article.totPrice;
          }
          break;
        }

      }

      if (
        (
          article.group1 === GROUP1.CUSTOM &&
          article.group3 !== "Operation"
        ) ||
        article.name === "YTTRE"
      ) {
        sectionPortfolio.countArtFlag.totArt += 1;
      }
      else if (!Number.isInteger(article.quantity)) {
        sectionPortfolio.countArtFlag.totArt += 1;
      }
      else {
        sectionPortfolio.countArtFlag.totArt += article.quantity;
      }

      sectionPortfolio.priceFlag.totPrice += article.totPrice;

    });

  });
}