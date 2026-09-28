export default class CombinationFreeStanding {
    constructor(originalTxt) {
		this.number = null;
		this.originalTxt = originalTxt;
		this.displayTxt = undefined;
		this.meObject = undefined;
		this.warrantyTxt = undefined;
		this.description = undefined;
		this.name = undefined;
		this.group1 = undefined;
		this.group2 = undefined;
		this.group3 = undefined;
		this.width = undefined;
		this.depth = undefined;
		this.height = 0;
		this.qualifier = false;
		this.carbonFilter = false;
		this.attachedPOF = false;
		this.articles = [];
    this.expAlert = [];
    this.missingAlert = [];
		this.withFlags = {
		doors: 0, drawerFronts: 0,  conection: false
	};
}

	addArticle(article) {
    this.articles.push(article);
  }
  returnArticles(){
	return this.articles;
  }
}