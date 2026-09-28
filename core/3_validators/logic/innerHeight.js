import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectInnerHeightData(sectionPortfolio) {

  const orders = [];
  const cabinetGroup = filter.Cabinet.group1;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const order = {
      header: header.number,
      width: Number(header.width),
      height: Number(header.height),
      depth: Number(header.depth),
      type: header.type,
      corner: header.corner,
      isSink: header.forFlags?.sink === true,
      isHobFan: header.forFlags?.hobFan === true,
      articles: []
    };

    header.returnArticles().forEach(article => {

      const innerHeightAffecting =
        String(article.innerHeightAffecting).trim().toLowerCase() === "true";
      
      if(article.group1 === cabinetGroup){return}
      
      order.articles.push({
        name: article.name,
        description: article.description,
        width: Number(article.width),
        height: Number(article.height),
        depth: Number(article.depth),
        quantity: Number(article.quantity) || 1,
        group1: article.group1,
        group2: article.group2,
        group3: article.group3,
        innerHeightAffecting // 👈 spara flaggan
      });

    });

    orders.push(order);

  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE ORDER
// -----------------------------------------------------
export function analyzeInnerHeightOrder(order) {

  const baseType = filter.Cabinet.group2.Base;

  let totalHeight = 0;
  let widthMismatch = false;
  let heightMismatch = false;
  let depthMismatch = false;
  let depthLess = false;

  // -------------------------------------
  // HÄMTA SPECIAL-LÅDOR (Sink / HobFan)
  // -------------------------------------
  let specialDrawerArticles = [];

  const isBaseCorner128 =
    order.type === baseType &&
    order.corner === true &&
    order.width === 128;

  if (!isBaseCorner128 && (order.isSink || order.isHobFan)) {

    const drawerArticles = order.articles.filter(article =>
      article.group1 === filter.Interior.group1 &&
      article.group2 === filter.Interior.group2.Drawer &&
      article.group3 === filter.Interior.group3.Drawer &&
      [40, 60, 80].includes(Number(article.width))
    );

    // Max 2 lådor, korrekt djupkombination
    const validDrawers = drawerArticles.filter(a =>
      a.depth === 45 || a.depth === 37
    ).slice(0, 2);

    specialDrawerArticles = validDrawers;

    // Höjd ska fortfarande räknas
    validDrawers.forEach(a => {
      totalHeight += a.height * a.quantity;
    });
  }

  if (order.articles.length === 0) {
    heightMismatch = false;
  }

  order.articles.forEach(article => {

    if (!article.innerHeightAffecting) return;
    let { width, height, depth, quantity, group1, group2, group3 } = article;

    // -------------------------------------
    // HOPPA ÖVER SPECIAL-LÅDOR (djupkontroll)
    // -------------------------------------
    const isSpecialDrawer = specialDrawerArticles.includes(article);
    if (isSpecialDrawer) {
    // Redan hanterad (höjd + specialregler)
      return;
    }
    // =====================================
    // SPECIALREGEL 1 – Cleaning
    // =====================================
    const isCleaning =
      group1 === filter.Interior.group1 &&
      group2 === filter.Interior.group2.Cleaning;

    if (isCleaning) {

      if (isNaN(width) || isNaN(height) || isNaN(depth)) {
        widthMismatch = true;
        heightMismatch = true;
        depthMismatch = true;
        return;
      }

      if (width !== 40 && width !== 60) {
        widthMismatch = true;
      }

      if (depth > order.depth) {
        depthMismatch = true;
      }

      totalHeight += height * quantity;
      return;
    }

    // =====================================
    // NaN-kontroll
    // =====================================
    if (isNaN(width) || isNaN(height) || isNaN(depth)) {

      if (isNaN(width)) widthMismatch = true;
      if (isNaN(height)) heightMismatch = true;
      if (isNaN(depth)) depthMismatch = true;

      return;
    }

    // =====================================
    // SPECIALREGEL 2 – BaseCorner128
    // =====================================
    const isBaseCorner128Drawer =
      isBaseCorner128 &&
      group1 === filter.Interior.group1 &&
      group2 === filter.Interior.group2.Drawer;

    if (isBaseCorner128Drawer) {

      if (width !== 60) widthMismatch = true;

      if (depth > order.depth) depthMismatch = true;

      totalHeight += height * quantity;
      return;
    }

    // =====================================
    // STANDARD LOGIK (med ny djuphantering)
    // =====================================
    if (width !== order.width) {
      widthMismatch = true;
      return;
    }

    // -------- NY LOGIK --------
    const isDrawer =
      group1 === filter.Interior.group1 &&
      group2 === filter.Interior.group2.Drawer &&
      group3 === filter.Interior.group3.Drawer;

    if (!isSpecialDrawer) {

      if (depth > order.depth) {
        depthMismatch = true;
        return;
      }

      if (
        !order.isSink &&
        !order.isHobFan &&
        isDrawer &&
        depth < order.depth
      ) {
        depthLess = true;
      }
    }

    totalHeight += height * quantity;

  });

  if (totalHeight > order.height) {
    heightMismatch = true;
  }

  return {
    ...order,
    calculatedHeight: totalHeight,
    widthOk: !widthMismatch,
    heightOk: !heightMismatch,
    depthOk: !depthMismatch,
    depthLess
  };
}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeInnerHeightOrders(orders) {

  const headers = orders.map(o => analyzeInnerHeightOrder(o));

  return { headers };
}