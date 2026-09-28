// coverPanels.js
import { data } from "../../1_parser/services/dataService.js";

/**
 * Sortering:
 * 1. name
 * 2. color
 * 3. width
 * 4. height
 */
const sortArticles = articles =>
  [...articles].sort((a, b) =>
    a.name.localeCompare(b.name) ||
    a.color.localeCompare(b.color) ||
    a.width - b.width ||
    a.height - b.height
  );

/**
 * Hämtar artiklar ENDAST från header:
 * SecondStageHeader + "Täcksidor"
 */
const getCoverPanelArticles = sectionPortfolio =>
  sectionPortfolio
    .returnHeaders()
    .filter(
      h =>
        h.constructor.name === "SecondStageHeader" &&
        h.originalTxt === "Täcksidor"
    )
    .flatMap(h => h.returnArticles());

/**
 * Skapar ett Set med unika kombinationer av name + color
 * baserat på artiklarna i rätt header
 */
const getAllowedNameColorSet = articles =>
  new Set(
    articles.map(a => `${a.name}__${a.color}`)
  );

/**
 * Matchar ALLA artiklar i databasen som:
 * - har rätt name + color
 * - group1 === "FrontFamilj"
 * - group2 === "Täcksida"
 */
const matchAgainstDatabase = allowedNameColors =>
  data.filter(db =>
    db.group1 === "FrontFamilj" &&
    db.group2 === "Täcksida" &&
    allowedNameColors.has(`${db.name}__${db.color}`)
  );

/**
 * Huvudfunktion
 */
export const getCpFamilies = sectionPortfolio => {
  // 1. Artiklar från rätt header
  const headerArticles =
    getCoverPanelArticles(sectionPortfolio);

  // 2. Unika name + color från headern
  const allowedNameColors =
    getAllowedNameColorSet(headerArticles);

  // 3. Matcha mot databasen + sortera
  const result =
    sortArticles(
      matchAgainstDatabase(allowedNameColors)
    );

  // 4. Spara resultatet
  sectionPortfolio.cPinOrder.push(...result);

};
