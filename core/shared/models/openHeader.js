export default class OpenHeader {
	constructor(originalTxt) {
	this.originalTxt = originalTxt; // ex.1. ME/MA 144 - Bänkskåp med lådor och innerlådor
	this.displayTxt = undefined;
	this.meObject = undefined;
	this.number = null; // ex. 1
	this.description = undefined;
	this.width = undefined;
 	this.depth = undefined;
  this.height = 0;
	this.type = undefined;
	this.attachedPOF = false;
	this.type = undefined;
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
}