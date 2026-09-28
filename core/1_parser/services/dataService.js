import ArticleDB from "../data/ArticleDB.js";

export const data = ArticleDB.map(str => {
  const parts = str.split("_");
  return {
    original: str,
    name: parts[0],
    description: parts[1],
    artNr: parts[2],
    width: Number(parts[3]),
    depth: Number(parts[4]),
    height: Number(parts[5]),
    color: parts[6],
    group1: parts[7],
    group2: parts[8],
    group3: parts[9],
    group4: parts[10],
    innerHeightAffecting: parts[11],
    outerHeightAffecting: parts[12],
    nrOfHinges: parts[13],
    quantityOne: parts[14]
  };
});