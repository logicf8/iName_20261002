//C:\PRIVAT\MinaProgram\iName\models\combinationHeader.js
export default class CombinationHeader {
	constructor(originalTxt) {
	this.originalTxt = originalTxt; // ex.1. ME/MA 144 - Bänkskåp med lådor och innerlådor
	this.meObject = undefined;
	this.displayTxt = undefined;
	this.forFlagTxt = undefined;
	this.warrantyTxt = undefined;
	this.applianceDescription = undefined;
	this.number = null;
	this.description = undefined;
	this.type = undefined;
	this.width = undefined;
 	this.depth = undefined;
  this.height = 0;
	this.attachedPOF = false;
	this.builtIn = false;
	this.corner = false;
	this.corner135 = false;

	this.forFlags = {
  	oven: false,
		combiMicro: false,
		compactOven: false,
  	micro: false,
  	hob: false,
  	hobFan: false,
  	fan: false,
		fridgeOrF: false,
		sink: false
	};

	this.withFlags = {
		pullOut: 0, carousel: 0, pullCorner: 0, larder: 0, cleaningInt: 0,
		drawers: 0, innerDF: 0, wireBaskets: 0, workSerfaces: 0, 
		conectFronts: 0, blind: false, shelfs: 0, glasDoors: 0, doors: 0,
	};

	this.drawersFlags = { drawerFront: 0, glasSides: 0 }

	this.hingeFlags = { h45: 0, h95: 0, h95C: 0, h110: 0, h153: 0, hHorr: 0 }
	this.takeSpace = 0;
	this.articles = [];
  this.expAlert = [];
  this.missingAlert = [];
	}
 	addArticle(article) {
  	this.articles.push(article);
  }
  returnArticles(){
		return this.articles;
  }
	returnDisplayTxt(){
		return this.displayTxt;
	}
}