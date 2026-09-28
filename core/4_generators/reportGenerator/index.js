//core\4_generators\reportGenerator\index.js
import { aggregateArticleStats } from "./aggregators/aggregateArticleStats.js";
import { createOverviewReports } from "./formatters/createOverviewReports.js";

export function generateReports(sectionPortfolio) {
  aggregateArticleStats(sectionPortfolio);
  createOverviewReports(sectionPortfolio);
}