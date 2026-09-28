import { filter } from '../../shared/global/myConstants.js';

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectSpotLightData(sectionPortfolio) {

  const wallType = filter.Cabinet.group2.Wall;

  const orders = [];
  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;
    if (header.type !== wallType) return;

    const order = {
      header: header.number,
      width: Number(header.width),
      type: header.type,
      width: header.width,
      depth: header.depth,
      height: header.height,
      articles: [],
      hasGlassDoor: false,
      spotQty: 0,
      spotArticles: [],
      hasCornerFrontAffecting: false
    };

    header.returnArticles().forEach(article => {

      const isSpot =
        article.group1 === filter.Light.group1 &&
        article.group2 === filter.Light.group2.Spot;

      const isGlassDoor =
        article.group1 === filter.Fronts.group1 &&
        article.group2 === filter.Fronts.group2.Door &&
        article.group3 === filter.Fronts.group3.GlassDoor;

      const isCornerFrontAffecting =
        article.group1 === filter.FrontAccessories.group1 &&
        article.group2 === filter.FrontAccessories.group2.FrontAffecting &&
        article.group3 === filter.FrontAccessories.group3.Corner;

      if (isCornerFrontAffecting) {
        order.hasCornerFrontAffecting = true;
      }

      if (isGlassDoor) {
        order.hasGlassDoor = true;
      }

      if (isSpot) {
        const qty = Number(article.quantity) || 1;

        order.spotQty += qty;

        order.spotArticles.push({
          name: article.name,
          color: article.color,
          watt: article.group3,
          quantity: qty
        });

        order.articles.push({
          name: article.name,
          color: article.color,
          watt: article.group3,
          quantity: qty
        });
      }

    });

    // ❌ Regel 1: Helt irrelevant skåp
    if (!order.hasGlassDoor && order.spotQty === 0) {
      return;
    }

    // ❌ Regel 2: Corner affecting kräver glasdörr
    if (order.hasCornerFrontAffecting && !order.hasGlassDoor) {
      return;
    }

    orders.push(order);

  });

  return orders;
}


// -----------------------------------------------------
// ANALYZE ORDER
// -----------------------------------------------------
export function analyzeSpotOrder(order) {

  let status = "✅";

  const { width, hasGlassDoor, spotQty, hasCornerFrontAffecting } = order;

  if (hasGlassDoor && spotQty === 0) {
    status = "❌";
  }
  else if (!hasGlassDoor && spotQty > 0) {
    status = "🟥 ⚠️ Ej vitrindörr ⚠️";
  }
  else if (hasGlassDoor && spotQty > 0) {

    if (hasCornerFrontAffecting && width === 80 && spotQty === 1) {
      status = "✅";
    }
    else if (width < 80 && spotQty === 1) {
      status = "✅";
    }
    else if (width === 80 && spotQty === 2) {
      status = "✅";
    }
    else {
      status = "🟥 ⚠️ Fel antal ⚠️";
    }
  }

  return {
    ...order,
    status
  };
}


// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeSpotOrders(orders) {

  const headers = orders.map(o => analyzeSpotOrder(o));

  let orderStatus = "";
  let pic = "";

  // -----------------------------
  // 🔍 GRUNDDATA
  // -----------------------------
  const totalSpots = headers.reduce((sum, h) => sum + h.spotQty, 0);
  const headersWithSpots = headers.filter(h => h.spotQty > 0).length;
  const headersWithGlass = headers.filter(h => h.hasGlassDoor).length;
  const totalHeaders = headers.length;

  // -----------------------------
  // 🚫 NY STOPPLOGIK
  // -----------------------------

  // ⬛ Inga vitrindörrar OCH inga spottar
  if (headersWithGlass === 0 && totalSpots === 0) {
    return {
      headers,
      orderStatus: "⬛ Nej",
      pic
    };
  }

  // 🟢 Vitrindörrar finns men inga spottar
  if (headersWithGlass > 0 && totalSpots === 0) {
    return {
      headers,
      orderStatus: "🟢 Nej",
      pic
    };
  }

  // ⚠️ Finns spottar men inte i alla relevanta skåp
  if (headersWithSpots < totalHeaders) {
    return {
      headers,
      orderStatus: "🟥 ⚠️ Saknas ⚠️",
      pic
    };
  }

  // -----------------------------
  // 🔴 PRIORITET: FEL
  // -----------------------------
  const priorityError = headers.find(h =>
    h.status === "❌" ||
    h.status === "🟥 ⚠️ Ej vitrindörr ⚠️" ||
    h.status === "🟥 ⚠️ Fel antal ⚠️"
  );

  if (priorityError) {
    return {
      headers,
      orderStatus: priorityError.status,
      pic
    };
  }

  // -----------------------------
  // 🎨 FÄRGLOGIK
  // -----------------------------
  const allSpots = headers.flatMap(h => h.spotArticles);

  const unique = {};
  allSpots.forEach(a => {
    const key = `${a.name}_${a.color}`;
    unique[key] = a;
  });

  const uniqueValues = Object.values(unique);

  if (uniqueValues.length === 1) {

    const a = uniqueValues[0];
    orderStatus = `🟩 Alla, ${a.name}, ${a.color}`;

    if (a.name === "MITTLED") {
      if (a.color === "vit") pic = "mittled_spot_white.avif";
      else if (a.color === "alu") pic = "mittled_spot_alu.avif";
      else if (a.color === "svart") pic = "mittled_spot_black.avif";
    }

  } 
  else if (uniqueValues.length > 1) {
    orderStatus = "Blandade färger";
  } 
  else {
    orderStatus = "🟩 Nej";
  }

  return {
    headers,
    orderStatus,
    pic
  };
}