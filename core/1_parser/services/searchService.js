import { data } from "./dataService.js";

export function findArticleByNumber(artNr) {
  return data.find(a => a.artNr === artNr) || null;
}