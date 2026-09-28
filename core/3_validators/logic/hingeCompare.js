import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectHingeData(sectionPortfolio) {
  const orders = [];

  const doorG1 = filter.Fronts.group1;
  const doorG2 = filter.Fronts.group2.Door;
  const drawerFrontG2 = filter.Fronts.group2.DrawerFront;

  const hingeG1 = filter.FrontAccessories.group1;
  const hingeG2 = filter.FrontAccessories.group2.Hinges;
  const hingeHorizontal = filter.FrontAccessories.group3.Horizontal;

  const pullOutG1 = filter.Interior.group1;
  const pullOutG2 = filter.Interior.group2.Drawer;
  const pullOutG3 = filter.Interior.group3.PullOut;

  sectionPortfolio.returnHeaders().forEach(header => {
    if (header.constructor.name !== "CombinationHeader") return;

    // SKIP RULE
    if (
      header.type === filter.Cabinet.group2.Base &&
      (Number(header.width) === 20 || Number(header.width) === 30)
    ) {
      const hasPullOut = header.returnArticles().some(article =>
        article.group1 === pullOutG1 &&
        article.group2 === pullOutG2 &&
        article.group3 === pullOutG3
      );

      if (hasPullOut) return;
    }

    const order = {
      header: header.number,
      type: header.type,
      width: header.width,
      depth: header.depth,
      height: header.height,
      doors: [],
      hinges: [],
      hasHorizontalHinges: false,
      hingeReduction: false
    };

    header.returnArticles().forEach(article => {
      const qty = Number(article.quantity) || 1;

      if (article.artNr === "202.699.31") {
        order.hingeReduction = true;
      }

      if (article.group1 === hingeG1 && article.group2 === hingeG2) {
        const isHorizontal = article.group3 === hingeHorizontal;

        if (isHorizontal) {
          order.hasHorizontalHinges = true;
        }

        order.hinges.push({
          article,
          quantity: qty,
          isHorizontal
        });
      }

      if (article.group1 === doorG1 && article.group2 === doorG2) {
        order.doors.push({ article, quantity: qty });
      }

      if (article.group1 === doorG1 && article.group2 === drawerFrontG2) {
        order.doors.push({
          article,
          quantity: qty,
          isDrawerFront: true
        });
      }
    });

    const isWallCornerCabinet =
      header.type === filter.Cabinet.group2.Wall &&
      Number(header.width) === 68;

    if (isWallCornerCabinet) {
      order.hinges.push({
        article: {
          width: 45,
          description: "Standard gångjärn (ingår stomme)"
        },
        quantity: 1,
        isHorizontal: false,
        isIncluded: true
      });
    }

    const hasRelevantData =
      order.doors.length > 0 ||
      order.hinges.some(h => h.isHorizontal || h.isIncluded);

    if (hasRelevantData) {
      orders.push(order);
    }
  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE ORDER
// -----------------------------------------------------
export function analyzeOrder(order) {
  let neededHinges = 0;
  let foundHinges = 0;

  const doorRows = [];
  const hingeRows = [];

  const hingeTypeSet = new Set();

  const doorLines = [];
  const drawerLines = [];

  // -----------------------------------------------------
  // SKIP RULE (Door on drawer)
  // -----------------------------------------------------
  if (order.hingeReduction && order.hinges.length === 0) {
    console.log(`[Hinge SKIP] No hinges + 202.699.31`);

    return {
      header: order.header,
      type: order.type,
      width: order.width,
      depth: order.depth,
      height: order.height,
      doorRows: [],
      hingeRows: [],
      hingeTypes: [],
      neededHinges: 0,
      foundHinges: 0,
      diff: 0,
      status: "OK"
    };
  }

  order.doors.forEach(d => {
    const a = d.article;
    const qty = d.quantity;

    if (d.isDrawerFront) {
      if (!order.hasHorizontalHinges) return;

      const hingesForThis = qty * 2;
      neededHinges += hingesForThis;

      drawerLines.push(`${a.width}×${a.height} (${qty} st)`);
      return;
    }
    // -----------------------------------------------------
    // APPLY HINGE REDUCTION
    // -----------------------------------------------------
    if (order.hingeReduction && order.hinges.length > 0) {
      neededHinges -= 2;

      console.log(`[Hinge Reduction] -2 applied`);

      // Skydd så det inte går negativt
      if (neededHinges < 0) neededHinges = 0;
    }

    const hingesPerDoor = Number(a.nrOfHinges) || 0;
    const hingesForThis = qty * hingesPerDoor;

    neededHinges += hingesForThis;

    doorLines.push(`${a.width}×${a.height} (${qty} st)`);
  });

  if (doorLines.length) {
    doorRows.push({
      text: `Dörr\n${doorLines.join("\n")}`
    });
  }

  if (drawerLines.length) {
    doorRows.push({
      text: `Lådfront\n${drawerLines.join("\n")}`
    });
  }

  order.hinges.forEach(h => {
    const a = h.article;
    const qty = h.quantity;

    if (!h.isHorizontal && a.width) {
      hingeTypeSet.add(String(a.width));
    }

    if (h.isHorizontal) {
      const total = h.isIncluded ? qty : qty * 2;
      foundHinges += total;

      hingeRows.push({
        text: `Horisontellt (${qty} st)`
      });
      return;
    }

    const total = qty * 2;
    foundHinges += total;

    hingeRows.push({
      text: `${a.width}° (${qty} st)`
    });
  });

  let status = "OK";

  if (foundHinges < neededHinges) status = "LOW";
  else if (foundHinges > neededHinges) status = "HIGH";

  return {
    header: order.header,
    type: order.type,
    width: order.width,
    depth: order.depth,
    height: order.height,
    doorRows,
    hingeRows,
    hingeTypes: Array.from(hingeTypeSet),
    neededHinges,
    foundHinges,
    diff: foundHinges - neededHinges,
    status
  };
}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeHinges(orders) {
  const headers = orders
    .map(o => analyzeOrder(o))
    .filter(h => h.doorRows.length > 0 || h.hingeRows.length > 0);

  // GLOBAL ANALYS
  const extraHeaders = headers.filter(h => h.diff > 0);
  const hasMissing = headers.some(h => h.diff < 0);

  let hasMatchingExtras = false;

  for (let i = 0; i < extraHeaders.length; i++) {
    for (let j = i + 1; j < extraHeaders.length; j++) {
      const a = extraHeaders[i];
      const b = extraHeaders[j];

      const overlap = a.hingeTypes.some(type =>
        b.hingeTypes.includes(type)
      );

      if (overlap) {
        hasMatchingExtras = true;
        break;
      }
    }
    if (hasMatchingExtras) break;
  }

  let globalStatus = "OK";

  if (hasMissing) globalStatus = "MISSING";
  else if (hasMatchingExtras) globalStatus = "EXTRA";

  return {
    headers,
    globalStatus
  };
}