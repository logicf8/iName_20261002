import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectShelfData(sectionPortfolio) {

  const orders = [];

  const shelfG1 = filter.Interior.group1;
  const shelfG2 = filter.Interior.group2.Shelf;

  const hingeG1 = filter.FrontAccessories.group1;
  const hingeG2 = filter.FrontAccessories.group2.Hinges;

  const frontsG1 = filter.Fronts.group1;
  const doorG2 = filter.Fronts.group2.Door;

  const cabinetG1 = filter.Cabinet.group1;
  const cabinetTopG2 = filter.Cabinet.group2.Top;

  const specialTypes = new Set([
    filter.Interior.group2.Drawer,
    filter.Interior.group2.WireBasket,
    filter.Interior.group2.WorkSurface,
    filter.Interior.group2.Pantry,
    filter.Interior.group2.Cleaning,
    filter.Interior.group2.Carousel,
    filter.Interior.group2.PullCorner
  ]);

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const shelves = [];
    const doors = [];
    const hinges = [];

    let hasSpecialInterior = false;
    let hasCabinetTop = false;
    let isFanCabinetWall = false;
    let isSpecialCabinet203780 = false;
    let noShelfNeeded = false;
    header.returnArticles().forEach(article => {

      if (article.group1 === shelfG1 && article.group2 === shelfG2) {
        shelves.push({
          width: Number(article.width),
          depth: Number(article.depth),
          color: article.color,
          quantity: Number(article.quantity) || 1
        });
      }

      if (article.group1 === frontsG1 && article.group2 === doorG2) {
        doors.push({
          group2: article.group2,
          group3: article.group3,
          width: Number(article.width),
          height: Number(article.height),
          quantity: Number(article.quantity) || 1
        });
      }

      if (
        article.group1 === shelfG1 &&
        specialTypes.has(article.group2)
      ) {
        hasSpecialInterior = true;
      }

      if (
        article.group1 === cabinetG1 &&
        article.group2 === cabinetTopG2
      ) {
        hasCabinetTop = true;
      }
      if (
        article.group1 === filter.Cabinet.group1 &&
        article.group2 === filter.Cabinet.group2.Wall &&
        article.group3 === filter.Cabinet.group3.Fan
      ) {
        isFanCabinetWall = true;
      }
      if (
        article.group1 === filter.Cabinet.group1 &&
        article.group2 === filter.Cabinet.group2.Wall &&
        Number(article.width) === 20 &&
        Number(article.depth) === 37 &&
        Number(article.height) === 80
      ) {
        isSpecialCabinet203780 = true;
      }

      if (article.group1 === hingeG1 && article.group2 === hingeG2) {
        hinges.push({
          width: Number(article.width),
          group3: article.group3
        });
      }
      if (
        article.group1 === hingeG1 &&
        article.group2 === hingeG2 &&
        article.artNr === "202.046.47"
      ) {
        noShelfNeeded = true;
      }
    });

    if (shelves.length === 0 && hinges.length === 0 && !hasCabinetTop) return;

    orders.push({
      header: header.number,
      type: header.type,
      width: Number(header.width),
      depth: Number(header.depth),
      height: Number(header.height),
      hasSink: header.forFlags?.sink === true,
      hasSpecialInterior,
      hasCabinetTop,
      isFanCabinetWall,
      isSpecialCabinet203780,
      noShelfNeeded,
      shelves,
      doors,
      hinges
    });

  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE ONE
// -----------------------------------------------------
export function analyzeShelfOrder(order) {

  const glassDoorType = filter.Fronts.group3.GlassDoor;

  const hasShelves = order.shelves.length > 0;
  const hasDoors = order.doors.length > 0;

  // REGEL 0
  if (order.height <= 40) {
    return { ...order, status: true, typeMismatch: false, missingShelves: false };
  }

  if (order.hasSink) {
    return { ...order, status: true, typeMismatch: false, missingShelves: false };
  }

  if (order.hasSpecialInterior) {
    return { ...order, status: true, typeMismatch: false, missingShelves: false };
  }

  if (order.hasCabinetTop) {
    return { ...order, status: true, typeMismatch: false, missingShelves: false };
  }

  // REGEL 4 & 5 – Stommar som EJ får ha hyllplan
  const noShelfAllowed =
    order.isFanCabinetWall ||
    order.isSpecialCabinet203780;

  if (noShelfAllowed) {
    return {
      ...order,
      status: order.shelves.length === 0,
      typeMismatch: false,
      missingShelves: false
    };
  }

  let status = true;
  let typeMismatch = false;
  let missingShelves = false;

  const allDoorsGlass =
    hasDoors && order.doors.every(d => d.group3 === glassDoorType);

  const noDoorsGlass =
    hasDoors && order.doors.every(d => d.group3 !== glassDoorType);

  const allShelvesGlass =
    hasShelves && order.shelves.every(s => s.color === "glas");

  const noShelvesGlass =
    hasShelves && order.shelves.every(s => s.color !== "glas");

  // REGEL 1
  if (hasDoors && hasShelves && allDoorsGlass && !allShelvesGlass) {
    status = false;
    typeMismatch = true;
  }

  // REGEL 2
  if (hasDoors && hasShelves && noDoorsGlass && !noShelvesGlass) {
    status = false;
    typeMismatch = true;
  }

  // REGEL 3
  const hasValidHinges = order.hinges.some(h =>
    h.width !== 95 &&
    h.group3 !== "hörnskåp"
  );

  if (order.height > 40 && hasValidHinges && !order.noShelfNeeded) {
    if (!hasShelves) {
      status = false;
      missingShelves = true;
    }
  }

  return { ...order, status, typeMismatch, missingShelves };
}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeShelfOrders(orders) {

  const headers = orders.map(analyzeShelfOrder);

  // COLOR SET (global)
  const normalizeColor = c => {
    if (!c) return null;
    const val = String(c).toLowerCase();

    if (val === "glas") return "Glas";
    if (val === "vit") return "Vit";
    if (val === "svartgrå") return "Svartgrå";

    return c;
  };

  const colorSet = new Set();

  headers.forEach(h => {
    (h.shelves || []).forEach(s => {
      const normalized = normalizeColor(s.color);
      if (normalized) colorSet.add(normalized);
    });
  });

  const colors = Array.from(colorSet);

  const hasRealError = headers.some(h =>
    h.status === false &&
    !h.typeMismatch &&
    !h.missingShelves
  );
  const hasTypeMismatch = headers.some(h => h.typeMismatch);
  const hasMissingShelves = headers.some(h => h.missingShelves);

  const glass = "Glas";

  const isGreen =
    !hasRealError &&
    !hasTypeMismatch &&
    !hasMissingShelves &&
    (
      colors.length === 0 ||
      colors.length === 1 ||
      (colors.length === 2 && colors.includes(glass))
    );

  let globalStatus = "OK";

  if (hasRealError) {
    globalStatus = "ERROR";
  }
  else if (hasMissingShelves) {
    globalStatus = "MISSING";
  }
  else if (hasTypeMismatch) {
    globalStatus = "TYPE_MISMATCH";
  }
  else if (!isGreen) {
    globalStatus = "COLOR_MIX";
  }

  return {
    headers,
    colors,
    globalStatus
  };
}