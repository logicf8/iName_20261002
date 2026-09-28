import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// RESULTATKODER
// -----------------------------------------------------
export const PNO_STATUS = {
  ALL: "ALL",
  SOME: "SOME",
  NONE: "NONE",
  DEPTH_ERROR: "DEPTH_ERROR",
  SAME_AS_OUTER: "SAME_AS_OUTER"
};

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectPushAndOpenData(sectionPortfolio) {

  const orders = [];

  const g1 = filter.Interior.group1;
  const g2 = filter.Interior.group2.Drawer;
  const g3Drawer = filter.Interior.group3.Drawer;
  const g3PullOut = filter.Interior.group3.PullOut;
  const g3Accessory = filter.Interior.group3.Accessory;
  const g3InnerFront = filter.Interior.group3.InnerDrawerFront;

  sectionPortfolio.returnHeaders().forEach(header => {
    if (header.constructor.name !== "CombinationHeader") return;

    const order = {
      id: header.number,
      type: header.type,
      width: header.width,
      depth: header.depth,
      height: header.height,
      drawers45n60: [],
      drawers37: [],
      pushAndOpen45n60: [],
      pushAndOpen37: [],
      innerFronts: [],
      outerFronts: []  // ✅ ny property
    };

    header.returnArticles().forEach(article => {
      const depth = Number(article.depth);
      const quantity = Number(article.quantity) || 1; // quantity korrekt

      // -----------------------
      // DRAWERS
      // -----------------------
      if (
        article.group1 === g1 &&
        article.group2 === g2 &&
        (article.group3 === g3Drawer || article.group3 === g3PullOut) &&
        article.name === "KNIVSHULT"
      ) {
        if (depth === 45 || depth === 60) order.drawers45n60.push({ article, quantity });
        if (depth === 37) order.drawers37.push({ article, quantity });
      }

      // -----------------------
      // PUSH AND OPEN
      // -----------------------
      if (
        article.group1 === g1 &&
        article.group2 === g2 &&
        article.group3 === g3Accessory
      ) {
        if (depth === 45 || depth === 60) order.pushAndOpen45n60.push({ article, quantity });
        if (depth === 37) order.pushAndOpen37.push({ article, quantity });
      }
      // -----------------------
      // OUTER FRONTS
      // -----------------------
      if (
        article.group1 === filter.Fronts.group1 &&
        article.group2 === filter.Fronts.group2.DrawerFront
      ) {
        let quantity = Number(article.quantity) || 1;
        if (article.height === 10) quantity *= 2;
        order.outerFronts.push({ article, quantity });
        
      }

      // -----------------------
      // INNER FRONTS
      // -----------------------
      if (
        article.group1 === g1 &&
        article.group2 === g2 &&
        article.group3 === g3InnerFront &&
        article.name === "KNIVSHULT"
      ) {
        order.innerFronts.push({ article, quantity });
      }

    });

    if (
      order.drawers45n60.length ||
      order.drawers37.length ||
      order.pushAndOpen45n60.length ||
      order.pushAndOpen37.length
    ) {
      orders.push(order);
    }
  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE ORDER
// -----------------------------------------------------
export function analyzeOrder(order) {

  // -----------------------
  // Summera antal per djup
  // -----------------------
  const drawersByDepth = {
    37: order.drawers37.reduce((sum, d) => sum + d.quantity, 0),
    "45n60": order.drawers45n60.reduce((sum, d) => sum + d.quantity, 0) // <-- ändring: summera alla 45+60 som en gemensam array
  };

  const pnoByDepth = {
    37: order.pushAndOpen37.reduce((sum, p) => sum + p.quantity, 0),
    "45n60": order.pushAndOpen45n60.reduce((sum, p) => sum + p.quantity, 0) // <-- ändring: summera alla 45+60 som en gemensam array
  };

// DEPTH_ERROR: fel djup eller fler push/open än lådor
const hasDepthError =
  (drawersByDepth[37] === 0 && pnoByDepth[37] > 0) ||
  (drawersByDepth["45n60"] === 0 && pnoByDepth["45n60"] > 0) ||
  (pnoByDepth[37] > drawersByDepth[37]) ||
  (pnoByDepth["45n60"] > drawersByDepth["45n60"]);

  // Totalsummor
  const totalDrawers = drawersByDepth[37] + drawersByDepth["45n60"];
  const totalPnO = pnoByDepth[37] + pnoByDepth["45n60"];
  const totalInner = order.innerFronts.reduce((sum, i) => sum + i.quantity, 0);
  const totalOuterFronts = order.outerFronts.reduce((sum, f) => sum + f.quantity, 0);
  let result;
  if (hasDepthError) {
    result = PNO_STATUS.DEPTH_ERROR;
  } else if (totalPnO === 0 && totalDrawers > 0) {
    result = PNO_STATUS.NONE;
  } else if (
    pnoByDepth[37] === drawersByDepth[37] &&
    pnoByDepth["45n60"] === drawersByDepth["45n60"]
  ) {
    result = PNO_STATUS.ALL;
  } else if (totalPnO > 0) {
    result = PNO_STATUS.SOME;
  } else {
    result = PNO_STATUS.NONE;
  }

  return {
    header: order.id,
    type: order.type,
    width: order.width,
    depth: order.depth,
    height: order.height,
    result,
    totalDrawers,
    totalPnO,
    totalInner,
    totalOuterFronts  // ✅ ny property
  };
}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeOrders(orders) {
  const headers = orders.map(order => analyzeOrder(order));

  // Totalsummering för alla headers
  const totalDrawers = headers.reduce((sum, h) => sum + h.totalDrawers, 0);
  const totalPnO = headers.reduce((sum, h) => sum + h.totalPnO, 0);
  const totalOuterFronts = headers.reduce((sum, h) => sum + h.totalOuterFronts, 0); // ✅ ny
  const hasDepthError = headers.some(h => h.result === PNO_STATUS.DEPTH_ERROR);

  let overallResult;

  if (hasDepthError) {
    overallResult = PNO_STATUS.DEPTH_ERROR;
  } 
  else if (totalPnO === totalOuterFronts && totalPnO > 0) {
    overallResult = PNO_STATUS.SAME_AS_OUTER; // ✅ din nya logik
  }
  else if (totalPnO === 0 && totalDrawers > 0) {
    overallResult = PNO_STATUS.NONE;
  } 
  else if (totalDrawers === totalPnO) {
    overallResult = PNO_STATUS.ALL;
  } 
  else if (totalPnO > 0) {
    overallResult = PNO_STATUS.SOME;
  } 
  else {
    overallResult = PNO_STATUS.NONE;
  }

  return { headers, overallResult, totalDrawers, totalPnO };
}