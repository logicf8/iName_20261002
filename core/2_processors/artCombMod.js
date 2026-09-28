// C:\PRIVAT\MinaProgram\iName\ValueModifiers\artCombMod.js

import { filter } from '../shared/global/myConstants.js';

export function artValuesModifyComb(sectionPortfolio, header) {
  header.returnArticles().forEach(article => {
    switch(article.group1) {
      case filter.Cabinet.group1:
        combinationTypeAndSize(sectionPortfolio, header, article);
        break;

      case filter.Appliance.group1:
        typeOfAppliance(sectionPortfolio, header, article);
        break;

      case filter.Interior.group1:
        interior(header, article);
        break;

      case filter.Fronts.group1:
        fronts(header, article);
        break;

      case filter.FrontAccessories.group1:
        frontAcc(header, article);
        break;

      case "Diskho":
        if(article.group2 !== "Tillbehör") {
          header.forFlags.sink = true;
          sectionPortfolio.cmInfoFlag.sinks += article.quantity;
        }
        else{
          switch(article.artNr) {
            case "406.204.80": 
            case "606.204.79":
            case "806.204.78": header.forFlags.sink = true; break;
      }
      break;
        }
        break;
    }
  });
}

// -----------------------------------------
// Hjälpfunktioner
// -----------------------------------------

function frontAcc(header, article) {
  switch(article.group2) {
    case filter.FrontAccessories.group2.Hinges:
      if(article.group3 === filter.FrontAccessories.group3.Horizontal) {
        header.hingeFlags.hHorr += article.quantity;
      }
      else {
        switch(article.width){
          case 110: { header.hingeFlags.h110 += article.quantity } break
          case 153: { header.hingeFlags.h153 += article.quantity } break
          case 45: { header.hingeFlags.h45 += article.quantity } break
          case 95: { article.group3 === "hörnskåp" ? header.hingeFlags.h95C += article.quantity : header.hingeFlags.h95 += article.quantity} break
        } break;
      }
      break;

    case filter.FrontAccessories.group2.FrontAffecting:
      if(article.group3 === filter.FrontAccessories.group3.DrawerOnDoor) {
        header.withFlags.doors -= article.quantity;
        header.drawersFlags.drawerFront += article.quantity;
      } else if(article.group3 === filter.FrontAccessories.group3.MountKit) {
        header.withFlags.drawers -= 2 * article.quantity;
        header.withFlags.pullOut += article.quantity;
      } else if(article.group3 === filter.FrontAccessories.group3.Connector) {
        header.withFlags.conectFronts += article.quantity;
        header.drawersFlags.drawerFront -= article.quantity;
      }
      break;
  }
}

function interior(header, article) {
  switch(article.group2) {
    case filter.Interior.group2.Drawer:
      switch(article.group3) {
        case filter.Interior.group3.Drawer: header.withFlags.drawers += article.quantity; break;
        case filter.Interior.group3.PullOut: header.withFlags.pullOut += article.quantity; break;
        case filter.Interior.group3.InnerDrawerFront: header.withFlags.innerDF += article.quantity; break;
      }
      break;

    case filter.Interior.group2.Shelf:
      let x = article.group3 === filter.Interior.group3.Drawer ? 1 : 2;
      header.withFlags.shelfs += article.quantity * x;
      break;

    case filter.Interior.group2.WireBasket: header.withFlags.wireBaskets += article.quantity; break;
    case filter.Interior.group2.WorkSurface: header.withFlags.workSerfaces += article.quantity; break;
    case filter.Interior.group2.Pantry: header.withFlags.larder += article.quantity; break;
    case filter.Interior.group2.Cleaning: header.withFlags.cleaningInt += article.quantity; break;
    case filter.Interior.group2.Carousel: header.withFlags.carousel += article.quantity; break;
    case filter.Interior.group2.PullCorner: header.withFlags.pullCorner += article.quantity; break;
  }
}

function fronts(header, article) {
  switch(article.group2) {
    case filter.Fronts.group2.Door:
      article.group3 === filter.Fronts.group3.GlassDoor
        ? header.withFlags.glasDoors += article.quantity
        : header.withFlags.doors += article.quantity;
      break;

    case filter.Fronts.group2.DrawerFront:
      let x = article.height === 10 ? 2 : 1;
      header.drawersFlags.drawerFront += article.quantity * x;
      break;
  }
}

function typeOfAppliance(sectionPortfolio, header, article) {
  switch(article.group2) {
    case filter.Appliance.group2.Oven: header.forFlags.oven = true; break;
    case filter.Appliance.group2.CompactOven: header.forFlags.compactOven = true; break;
    case filter.Appliance.group2.CombiMicro: header.forFlags.combiMicro = true; break;
    case filter.Appliance.group2.Micro: header.forFlags.micro = true; break;
    case filter.Appliance.group2.Hob:
      article.group3 === filter.Appliance.group3.BuiltInFan
        ? header.forFlags.hobFan = true
        : header.forFlags.hob = true;
      sectionPortfolio.cmInfoFlag.hobs += article.quantity;
      break;
    case filter.Appliance.group2.Fan: header.forFlags.fan = true; break;
    case filter.Appliance.group2.Fridge:
      header.forFlags.fridgeOrF = true;
      header.applianceDescription ??= article.description;
      break;
    case filter.Appliance.group2.Accessories:
      switch(article.artNr) {
        case "102.432.96": 
        case "302.432.95": header.forFlags.hob = true; break;
        case "302.214.58": header.forFlags.fridgeOrF = true; break;
        case "103.019.60": header.forFlags.oven = true; break;
      }
      break;
  }
}

function combinationTypeAndSize(sectionPortfolio, header, article) {
  let type = "";
  if(header.description === undefined || article.description === filter.Cabinet.group2.Base || article.description === filter.Cabinet.group2.High) {
    if(article.group2 === filter.Cabinet.group2.Top && header.originalTxt.includes("METOD - Base cabinet") || header.originalTxt.includes("METOD - Bänkskåp med lådor")) {
      header.description = `${filter.Cabinet.group2.Base} ${article.width} cm av överskåp`;
      type = filter.Cabinet.group1;
    }
    else if(article.group2 === filter.Cabinet.group2.Base && header.originalTxt.includes("Bänkhörnskåp 135 grader")) {
      header.description = `${filter.Cabinet.group2.Base} i hörn ${article.width} cm`;
      header.corner135 = true;
      type = filter.Cabinet.group1;
      sectionPortfolio.cmInfoFlag.corner135 += article.quantity;
    }
    else {
      let thisWidth;
      if(article.width === 128){
        thisWidth = "127,5"
        header.builtIn = true;
      }
      else if(article.width === 88){
        thisWidth = "87,5"
      }
      else if(article.width === 68){
        thisWidth = "67,5"
      }
      else { thisWidth = article.width}
      header.description = `${article.description} ${thisWidth} cm`;
      type = article.group2;
    }
    
    header.type = type;
    header.width = parseInt(article.width);
    header.depth = parseInt(article.depth);
  }
    header.height += parseInt(article.height);
  switch(article.group3) {
    case filter.Cabinet.group3.BuiltIn: header.builtIn = true; break;
    case filter.Cabinet.group3.Corner:
      header.corner = true;
      if(article.group2 === "Bänkskåp"){
        sectionPortfolio.cmInfoFlag.corners += article.quantity;
      }

      break;
    case filter.Cabinet.group3.Fan: header.fan = true; break;
  }
}
