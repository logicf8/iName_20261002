import { filter } from '../shared/global/myConstants.js';

export function artValuesModifyFreeS(sectionPortfolio, header) {
  header.returnArticles().forEach(article => {
    switch(article.group1) {
      case filter.Appliance.group1: // Vitvaror
        if(article.group2 !== filter.Appliance.group2.Accessories) { // Ej tillbehör
          // FREESTANDING: endast en vitvara
          header.qualifier = true;
          header.name = article.name;
          header.description = article.description;
          header.group1 = article.group1;
          header.group2 = article.group2;
          header.group3 = article.group3;
          header.width = article.width;
          header.depth = article.depth;
          header.height = article.height;
        } else {
          if(article.group3 === filter.Appliance.group3.Fan && article.group4 === filter.Appliance.group4.CarbonFilter) {
            header.carbonFilter = true;}
          else if(article.group2 === filter.Appliance.group2.Accessories && article.artNr === "005.181.92"){
            header.withFlags.conection = true;
          }
          
        }
        break;

      case filter.Fronts.group1: // FrontFamilj
        fronts(header, article);
        break;
    }
  });
}

function fronts(header, article) {
  switch(article.group2) {
    case filter.Fronts.group2.Door:
      header.withFlags.doors += article.quantity;
      break;

    case filter.Fronts.group2.DrawerFront:
      header.withFlags.drawerFronts += article.quantity;
      break;
  }
}
