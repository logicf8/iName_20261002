import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectOuterWidthHeightData(sectionPortfolio) {

  const orders = [];

  const wallType = filter.Cabinet.group2.Wall;
  const baseType = filter.Cabinet.group2.Base;
  const frontsGroup1 = filter.Fronts.group1;
  const doorType = filter.Fronts.group2.Door;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const order = {
      header: header.number,
      width: Number(header.width),
      depth: Number(header.depth),
      height: Number(header.height),
      corner: header.corner,
      type: header.type,
      articles: [],
      hasCornerFrontAffecting: false
    };

    const horizontalArticles = header.returnArticles().filter(a =>
      a.group1 === filter.FrontAccessories.group1 &&
      a.group3 === filter.FrontAccessories.group3.Horizontal
    );

    const cornerFrontArticles = header.returnArticles().filter(a =>
      a.group1 === filter.FrontAccessories.group1 &&
      a.group2 === filter.FrontAccessories.group2.FrontAffecting &&
      a.group3 === filter.FrontAccessories.group3.Corner
    );

    const totalHorizontalQty = horizontalArticles.reduce(
      (sum, a) => sum + (Number(a.quantity) || 1), 0
    );

    // Sätt flagga om någon CornerFrontAffecting finns
    if (cornerFrontArticles.length > 0) {
      order.hasCornerFrontAffecting = true;
    }

    // Behandla alla artiklar
    header.returnArticles().forEach(article => {

      const outerHeightAffecting =
        String(article.outerHeightAffecting).trim().toLowerCase() === "true";

      let width = Number(article.width);
      let height = Number(article.height);
      const qty = Number(article.quantity) || 1;

      let calcWidth = width;
      let calcHeight = height;

      const isCornerFrontAffecting =
        article.group1 === filter.FrontAccessories.group1 &&
        article.group2 === filter.FrontAccessories.group2.FrontAffecting &&
        article.group3 === filter.FrontAccessories.group3.Corner;

      // ⭐ Lägg in CornerFrontAffecting som info-artikel (som horizontal)
      if (isCornerFrontAffecting) {
        order.articles.push({
          name: `${article.description} (${qty} st)`,
          width,
          height,
          calcWidth: 0,
          calcHeight: 0,
          quantity: qty,
          group1: article.group1,
          group2: article.group2,
          group3: article.group3,
          isCornerFrontAffecting: true
        });
        return; // gå vidare, påverkar inte outerHeightAffecting
      }

      // ⭐ Vitrindörrar – swap för höjdberäkning
      if (outerHeightAffecting) {
        if (article.group3 === filter.Fronts.group3.GlassDoor && totalHorizontalQty > 0) {
          [calcWidth, calcHeight] = [height, width];
        }

        order.articles.push({
          name: `${article.group2} ${width}x${height}`,
          width,
          height,
          calcWidth,
          calcHeight,
          quantity: qty,
          group1: article.group1,
          group2: article.group2,
          group3: article.group3
        });
      }
    });

    // Lägg till horisontella artiklar – endast som info
    horizontalArticles.forEach(hArt => {
      const qty = Number(hArt.quantity) || 1;
      order.articles.push({
        name: `${hArt.group2} ${hArt.group3} (${qty} st)`,
        width: Number(hArt.width),
        depth: Number(hArt.depth),
        height: Number(hArt.height),
        calcWidth: 0,
        calcHeight: 0,
        quantity: qty,
        group1: hArt.group1,
        group2: hArt.group2,
        group3: hArt.group3
      });
    });

    orders.push(order);

  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE ORDER
// -----------------------------------------------------
export function analyzeOrder(order) {

  let totalHeight = 0;
  let widthMismatch = false;

  const hasHAVSEN = order.articles.some(a =>
    a.group1 === filter.Sink.group1 &&
    a.group2 === filter.Sink.group2.Sink &&
    a.group3 === filter.Sink.group3.Havsen
  );

  const hasCornerFrontAffecting = order.hasCornerFrontAffecting === true;

  const wallType = filter.Cabinet.group2.Wall;
  const baseType = filter.Cabinet.group2.Base;
  const frontsGroup1 = filter.Fronts.group1;
  const doorType = filter.Fronts.group2.Door;

  order.articles.forEach(article => {

    let { width, height, calcWidth, calcHeight, quantity, group1, group2, group3 } = article;

    // ⭐ Ignorera artiklar som bara är info (CornerFrontAffecting eller Horizontal)
    if (calcHeight === 0) return;

    // =====================================
    // ⭐ SPECIALREGEL 1 – Väggskåp Hörn + Dörr → 40
    // =====================================
    const isWallCorner =
      order.type === wallType &&
      order.corner === true &&
      group1 === frontsGroup1 &&
      group2 === doorType;

    if (isWallCorner) {
      if (width !== 40) widthMismatch = true;
      totalHeight += height * quantity;
      return;
    }

    // =====================================
    // ⭐ SPECIALREGEL 2 – Bänkskåp Hörn 88 → 25/26
    // =====================================
    const isBaseCorner88 =
      order.type === baseType &&
      order.corner === true &&
      order.width === 88 &&
      group1 === frontsGroup1 &&
      group2 === doorType;

    if (isBaseCorner88) {
      if (width !== 25 && width !== 26) widthMismatch = true;
      totalHeight += height * quantity;
      return;
    }

    // =====================================
    // ⭐ SPECIALREGEL 3 – Bänkskåp Hörn 128 → 60
    // =====================================
    const isBaseCorner128 =
      order.type === baseType &&
      order.corner === true &&
      order.width === 128 &&
      group1 === frontsGroup1 &&
      (group2 === doorType || group2 === filter.Fronts.group2.DrawerFront);

    if (isBaseCorner128) {
      if (width !== 60) widthMismatch = true;
      totalHeight += height * quantity;
      return;
    }

    // =====================================
    // ⭐ SPECIALREGEL 4 – Wall 80 + CornerFrontAffecting → behandla 40 som 80
    // =====================================
    let effectiveCalcWidth = calcWidth;

    if (
      order.type === wallType &&
      order.width === 80 &&
      hasCornerFrontAffecting &&
      group1 === frontsGroup1 &&
      group2 === doorType &&
      width === 40
    ) {
      effectiveCalcWidth = 80;
    }

    // =====================================
    // ⭐ DrawerFront ×2 höjd
    // =====================================
    const drawerFrontDoubleHeight =
      group1 === frontsGroup1 &&
      group2 === filter.Fronts.group2.DrawerFront &&
      height === 10;

    if (drawerFrontDoubleHeight) {
      if (hasHAVSEN) {
        totalHeight += height * quantity;
      } else {
        totalHeight += height * 2 * quantity;
      }
      return;
    }

    // =====================================
    // NORMAL LOGIK – använd effectiveCalcWidth
    // =====================================
    if (effectiveCalcWidth === order.width && calcHeight > 0) {
      totalHeight += calcHeight * quantity;

    } else if (effectiveCalcWidth * 2 === order.width && calcHeight > 0) {

      if (quantity % 2 === 0) {
        totalHeight += (quantity / 2) * calcHeight;

      } else if (!(order.type === wallType && order.corner === true)) {
        widthMismatch = true;

      } else {
        totalHeight += (quantity / 2) * calcHeight;
      }

    } else if (calcHeight > 0) {
      widthMismatch = true;
      totalHeight += calcHeight * quantity;
    }

  });

  const heightMatch = totalHeight === order.height;

  return {
    header: order.header,
    width: order.width,
    depth: order.depth,
    height: order.height,
    corner: order.corner,
    type: order.type,
    articles: order.articles,
    hasCornerFrontAffecting: order.hasCornerFrontAffecting,
    calculatedHeight: totalHeight,
    widthOk: !widthMismatch,
    heightOk: heightMatch
  };

}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeOrders(orders) {

  const headers = orders.map(order => analyzeOrder(order));

  return {
    headers
  };

}