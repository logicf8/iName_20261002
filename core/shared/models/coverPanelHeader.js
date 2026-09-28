export default class CoverPanelHeader {
	constructor(originalTxt) {
	this.number = null; // ex. 1
	this.originalTxt = originalTxt; // ex.1. Passbit för väggskåp
	this.displayTxt = undefined;
	this.type = "coverPanelOrFittingPice";
	this.articles = [];
	this.owner = "none";
	this.fittingPice = false;
	this.ceilingFittingPice = false;
	this.coverPanel = false;
	this.attachedPOF = true;
	this.cornerFittingPice = false;
  }

	addArticle(article) {
		this.articles.push(article);
  }
  returnArticles(){
	  return this.articles;
  }
}

