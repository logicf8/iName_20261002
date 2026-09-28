export default class SectionPortfolio {
    constructor() {
      this.cmInfoFlag = {
      corners: 0,
      corner135: 0,
      sinks: 0,
      hobs: 0,
      wtInfo: undefined,
      wpInfo: undefined
    }

    this.countArtFlag = {
      totArt: 0,
      cabinets: 0,
      appliance: 0,
      fronts: 0
    }
    this.priceFlag = {
      totPrice: 0,
      pCabinets: 0,
      pAppliances: 0,
      pFronts: 0,
    }

    this.drawNR = undefined
    this.displayTxts = [];
    this.reportTxts = [];
    this.checkTxts = [];
    this.headers = [];
    this.expAlert = [];
    this.cPinOrder = [];
    this.needDiff = false;
  }

  addCombinationHeader(comboHeader) {
  this.headers.push(comboHeader);
  }

  addCpFpHeader(cPanelHeader) {
  this.headers.push(cPanelHeader);
  }
  addOpenHeader(openCpHeader) {
  this.headers.push(openCpHeader);
  }
  addSecondStageHeader(ssHeader) {
  this.headers.push(ssHeader);
  }
  returnHeaders(){
    return this.headers
  }
  returnDisplayTxts(){
    return this.displayTxts;
  }
  returncheckTxts(){
    return this.checkTxts;
  }

    returnReportTxts(){
    return this.reportTxts;
  }
  getAllArticles() {
  return this.headers.flatMap(header => header.articles || []);
}
}
