// models/secondStageHeader.js
export default class SecondStageHeader {
  constructor(originalTxt) {
      this.originalTxt = originalTxt; 
      this.displayTxt = undefined;
      this.type = "none2";
      this.attachedPOF = false;
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