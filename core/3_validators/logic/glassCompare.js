import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// RESULTATKODER
// -----------------------------------------------------
export const GLASS_STATUS = {
  ALL: "ALL",
  NONE: "NONE",
  ONLY_HIGH: "ONLY_HIGH",
  SOME: "SOME",
  HIGH_MISSING: "HIGH_MISSING",
  MEDIUM_MISSING: "MEDIUM_MISSING",
  DEPTH_ERROR: "DEPTH_ERROR"
};

// -----------------------------------------------------
// COLLECTOR
// -----------------------------------------------------
export function collectDrawersAndGlassByDepthAndHeight(sectionPortfolio) {

  const orders = [];

  const group1Value = filter.Interior.group1;
  const group2DrawerValue = filter.Interior.group2.Drawer;
  const drawerValue = filter.Interior.group3.Drawer;
  const pullOutValue = filter.Interior.group3.PullOut;
  const addOnSidesValue = filter.Interior.group3.AddOnSides;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const order = {
      id: header.number,
      type: header.type,
      width: header.width,
      depth: header.depth,
      height: header.height,
      storlekar: {}
    };

    const ensureSize = (key) => {
      if (!order.storlekar[key]) {
        order.storlekar[key] = { lador: 0, glassidor: 0 };
      }
    };

    header.returnArticles().forEach(article => {

      if (article.name !== "MAXIMERA") return;

      const depth = String(article.depth || "").trim();

      const rawHeight = (article.group4 || "")
        .toString()
        .toLowerCase()
        .trim();

      let height = null;
      if (rawHeight === "hög") height = "hög";
      if (rawHeight === "med") height = "med";

      const qty = Number(article.quantity) || 1;

      // -----------------------
      // VANLIGA LÅDOR
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === drawerValue &&
        height &&
        depth !== "45"
      ) {
        const key = `${depth}-${height}`;
        ensureSize(key);
        order.storlekar[key].lador += qty;
      }

      // -----------------------
      // PULLOUT
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === pullOutValue
      ) {
        ["med", "hög"].forEach(h => {
          const key = `60-${h}`;
          ensureSize(key);
          order.storlekar[key].lador += qty;
        });
      }

      // -----------------------
      // GLASSIDOR
      // -----------------------
      if (
        article.group1 === group1Value &&
        article.group2 === group2DrawerValue &&
        article.group3 === addOnSidesValue &&
        height
      ) {
        const key = `${depth}-${height}`;
        ensureSize(key);
        order.storlekar[key].glassidor += qty;
      }

    });

    if (Object.keys(order.storlekar).length > 0) {
      orders.push(order);
    }

  });

  return orders;
}

// -----------------------------------------------------
// ANALYS AV EN ORDER
// -----------------------------------------------------
export function analyzeOrder(order) {

  if (!order.storlekar) {
    return {
      header: order.id,
      result: GLASS_STATUS.NONE,
      details: []
    };
  }

  let drawersHigh = 0;
  let drawersMed = 0;
  let glassHigh = 0;
  let glassMed = 0;

  let depthError = false;

  Object.entries(order.storlekar).forEach(([key, val]) => {

    const [depth, height] = key.split("-");
    const drawers = val.lador || 0;
    const glass = val.glassidor || 0;

    // Djup 45 kan inte ha glassidor
    if (depth === "45") return;

    if (glass > drawers) depthError = true;

    if (height === "hög") {
      drawersHigh += drawers;
      glassHigh += glass;
    }

    if (height === "med") {
      drawersMed += drawers;
      glassMed += glass;
    }

  });

  const totalDrawers = drawersHigh + drawersMed;
  const totalGlass = glassHigh + glassMed;

  const details = [];

  if (drawersHigh > glassHigh) {
    details.push(GLASS_STATUS.HIGH_MISSING);
  }

  if (drawersMed > glassMed) {
    details.push(GLASS_STATUS.MEDIUM_MISSING);
  }

  let result = GLASS_STATUS.SOME;

  if (depthError) {
    result = GLASS_STATUS.DEPTH_ERROR;
  }

  else if (totalGlass === 0) {
    result = GLASS_STATUS.NONE;
  }

  else if (totalGlass === totalDrawers) {
    result = GLASS_STATUS.ALL;
  }

  // ONLY_HIGH kräver perfekt match på höga lådor
  else if (
    drawersMed === 0 &&
    drawersHigh > 0 &&
    glassHigh === drawersHigh
  ) {
    result = GLASS_STATUS.ONLY_HIGH;
  }
  return {
    header: order.id,
    type: order.type,
    width: order.width,
    depth: order.depth,
    height: order.height,
    result,
    details
  };

}

// -----------------------------------------------------
// ANALYS AV ALLA ORDERS
// -----------------------------------------------------
export function analyzeOrders(orders) {

  const perHeader = [];

  if (!orders || orders.length === 0) {
    return {
      headers: [],
      total: GLASS_STATUS.NONE
    };
  }

  let totalHighDrawers = 0;
  let totalHighGlass = 0;
  let totalMediumGlass = 0;

  let anyGlass = false;
  let depthError = false;

  const resultSet = new Set();

  orders.forEach(order => {

    const result = analyzeOrder(order);

    perHeader.push(result);
    resultSet.add(result.result);

    Object.entries(order.storlekar).forEach(([key, val]) => {

      const [depth, height] = key.split("-");
      const drawers = val.lador || 0;
      const glass = val.glassidor || 0;

      if (depth === "45") return;

      if (glass > 0) anyGlass = true;
      if (glass > drawers) depthError = true;

      if (height === "hög") {
        totalHighDrawers += drawers;
        totalHighGlass += glass;
      }

      if (height === "med") {
        totalMediumGlass += glass;
      }

    });

  });

  let totalResult = GLASS_STATUS.SOME;

  // 🟥 alltid högst prioritet
  if (depthError) {
    totalResult = GLASS_STATUS.DEPTH_ERROR;
  }

  // 🟩 INGA LÅDOR = OK
  else if (!anyGlass) {
    totalResult = GLASS_STATUS.NONE;
  }

  // 🟩 ONLY HIGH = OK
  else if (
    totalHighDrawers > 0 &&
    totalHighDrawers === totalHighGlass &&
    totalMediumGlass === 0
  ) {
    totalResult = GLASS_STATUS.ONLY_HIGH;
  }

  // 🟩 ALL = OK
  else if (resultSet.size === 1 && resultSet.has(GLASS_STATUS.ALL)) {
    totalResult = GLASS_STATUS.ALL;
  }

  // 🟥 allt annat
  else {
    totalResult = GLASS_STATUS.SOME;
  }

  return {
    headers: perHeader,
    total: totalResult
  };

}