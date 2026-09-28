import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// RESULTATKODER
// -----------------------------------------------------
export const DRAWER_LIGHT_STATUS = {
  ALL: "ALL",
  SOME: "SOME",
  NONE: "NONE",
  DEPTH_ERROR: "DEPTH_ERROR"
};

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectDrawerLights(sectionPortfolio) {

  const orders = [];

  const g1Light = filter.Light.group1;
  const g2Light = filter.Light.group2.drawerLighting;

  const g1Drawer = filter.Interior.group1;
  const g2Drawer = filter.Interior.group2.Drawer;
  const g3Drawer = filter.Interior.group3.Drawer;
  const g3InnerFront = filter.Interior.group3.InnerDrawerFront;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const order = {
      id: header.number,
      type: header.type,
      width: header.width,
      depth: header.depth,
      height: header.height,
      cabinet: `${header.width} cm`,
      lights36: [],
      lights56: [],
      lights76: [],

      drawers40: [],
      drawers60: [],
      drawers80: [],

      innerFronts: []
    };

    header.returnArticles().forEach(article => {

      const width = Number(article.width);
      const quantity = Number(article.quantity) || 1;

      // -----------------------
      // DRAWER LIGHTS
      // -----------------------
      if (
        article.group1 === g1Light &&
        article.group2 === g2Light
      ) {

      const watt = article.group3;

      if (width === 36) order.lights36.push({ article, quantity, watt });
      if (width === 56) order.lights56.push({ article, quantity, watt });
      if (width === 76) order.lights76.push({ article, quantity, watt });

      }

      // -----------------------
      // DRAWERS
      // -----------------------
      if (
        article.group1 === g1Drawer &&
        article.group2 === g2Drawer &&
        article.group3 === g3Drawer
      ) {

        if (width === 40) order.drawers40.push({ article, quantity });
        if (width === 60) order.drawers60.push({ article, quantity });
        if (width === 80) order.drawers80.push({ article, quantity });

      }

      // -----------------------
      // INNER FRONTS
      // -----------------------
      if (
        article.group1 === g1Drawer &&
        article.group2 === g2Drawer &&
        article.group3 === g3InnerFront
      ) {
        order.innerFronts.push({ article, quantity });
      }

    });

    if (
      order.drawers40.length ||
      order.drawers60.length ||
      order.drawers80.length ||
      order.lights36.length ||
      order.lights56.length ||
      order.lights76.length ||
      order.innerFronts.length
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

  const drawers40 = order.drawers40.reduce((s, d) => s + d.quantity, 0);
  const drawers60 = order.drawers60.reduce((s, d) => s + d.quantity, 0);
  const drawers80 = order.drawers80.reduce((s, d) => s + d.quantity, 0);

  const lights36 = order.lights36.reduce((s, l) => s + l.quantity, 0);
  const lights56 = order.lights56.reduce((s, l) => s + l.quantity, 0);
  const lights76 = order.lights76.reduce((s, l) => s + l.quantity, 0);

  const innerTotal = order.innerFronts.reduce((s, i) => s + i.quantity, 0);

  const totalDrawers = drawers40 + drawers60 + drawers80;
  const totalLights = lights36 + lights56 + lights76;

  const allLights = [
    ...order.lights36,
    ...order.lights56,
    ...order.lights76
  ];

  let totalWatt = 0;

  allLights.forEach(l => {

    if (!l.watt || l.watt === "N/A") {
      return;
    }

    const wattValue = parseFloat(
      String(l.watt).replace(",", ".")
    );

    if (!isNaN(wattValue)) {
      totalWatt += wattValue * (l.quantity || 1);
    }

  });
  // -----------------------
  // Depth error: saknad låda eller fler belysningar än lådor
  // -----------------------
  const hasDepthError =
    (drawers40 === 0 && lights36 > 0) || (lights36 > drawers40) ||
    (drawers60 === 0 && lights56 > 0) || (lights56 > drawers60) ||
    (drawers80 === 0 && lights76 > 0) || (lights76 > drawers80);

  let result;

  if (hasDepthError) result = DRAWER_LIGHT_STATUS.DEPTH_ERROR;
  else if (totalLights === 0 && totalDrawers > 0) result = DRAWER_LIGHT_STATUS.NONE;
  else if (
    lights36 === drawers40 &&
    lights56 === drawers60 &&
    lights76 === drawers80
  ) result = DRAWER_LIGHT_STATUS.ALL;
  else if (totalLights > 0) result = DRAWER_LIGHT_STATUS.SOME;
  else result = DRAWER_LIGHT_STATUS.NONE;

  return {
    header: order.id,
    type: order.type,
    width: order.width,
    depth: order.depth,
    height: order.height,
    cabinet: order.cabinet,
    result,
    totalDrawers,
    totalLights,
    totalInner: innerTotal,
    totalWatt
  };
}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeDrawerLights(orders) {

  const headers = orders.map(order => analyzeOrder(order));

  const totalDrawers = headers.reduce((s, h) => s + h.totalDrawers, 0);
  const totalLights = headers.reduce((s, h) => s + h.totalLights, 0);
  const totalInner = headers.reduce((s, h) => s + h.totalInner, 0);

  const hasDepthError = headers.some(h => h.result === DRAWER_LIGHT_STATUS.DEPTH_ERROR);

  let overallResult;

  if (hasDepthError) overallResult = DRAWER_LIGHT_STATUS.DEPTH_ERROR;
  else if (totalLights === 0 && totalDrawers > 0) overallResult = DRAWER_LIGHT_STATUS.NONE;
  else if (totalLights === totalDrawers) overallResult = DRAWER_LIGHT_STATUS.ALL;
  else if (totalLights > 0) overallResult = DRAWER_LIGHT_STATUS.SOME;
  else overallResult = DRAWER_LIGHT_STATUS.NONE;

  return {
    headers,
    overallResult,
    totalDrawers,
    totalLights,
    totalInner
  };
}