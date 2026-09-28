import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectUnusualDrawerData(sectionPortfolio) {

  const orders = [];

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader") return;

    const allArticles = header.returnArticles();

    const drawerArticles = allArticles.filter(article =>
      article.group1 === filter.Interior.group1 &&
      article.group2 === filter.Interior.group2.Drawer &&
      article.group3 === filter.Interior.group3.Drawer &&
      [40, 60, 80].includes(Number(article.width))
    );

    if (drawerArticles.length === 0) return;

    const drawerFronts = allArticles.filter(article =>
      article.group1 === filter.Fronts.group1 &&
      article.group2 === filter.Fronts.group2.DrawerFront
    );

    orders.push({
      header: header.number,
      width: Number(header.width),
      depth: Number(header.depth),
      height: Number(header.height),
      type: header.type,
      forFlags: header.forFlags,
      drawerArticles,
      drawerFronts,
      allArticles
    });

  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE
// -----------------------------------------------------
export function analyzeUnusualDrawerOrders(orders) {

  const headers = orders.map(order => {

    let low = 0;
    let medium = 0;
    let high = 0;

    const flags = order.forFlags || {};

    const isHobFan = flags.hobFan;
    const isSink = flags.sink;

    // -------------------------
    // NYTT: ORSAKSLISTA
    // -------------------------
    const ruleTriggers = [];

    if (isHobFan && isSink) {
      ruleTriggers.push("Häll med fläkt");
      ruleTriggers.push("Häll");
      ruleTriggers.push("Diskho");
    }
    else if (isHobFan) {
      ruleTriggers.push("Häll med fläkt");
      ruleTriggers.push("Häll");
    }
    else if (isSink) {
      ruleTriggers.push("Diskho");
    }

    // -------------------------
    // HINGE DETECTION
    // -------------------------
    const hingeArticles = (order.allArticles || []).filter(a =>
      a.group1 === filter.FrontAccessories.group1 &&
      a.group2 === filter.FrontAccessories.group2.Hinges &&
      a.width === 153
    );
    const hasHinge = hingeArticles.length > 0;

    if (hasHinge) {
      ruleTriggers.push("153°");
    }

    // -------------------------
    // Räkna lådor
    // -------------------------
    order.drawerArticles.forEach(a => {
      const qty = Number(a.quantity) || 1;

      if (a.group4 === filter.Interior.group4.low) low += qty;
      if (a.group4 === filter.Interior.group4.medium) medium += qty;
      if (a.group4 === filter.Interior.group4.high) high += qty;
    });

    const combo = [low, medium, high];

    // -------------------------
    // Drawer fronts
    // -------------------------
    let totalFronts = 0;
    let totalHeight = 0;

    order.drawerFronts.forEach(a => {
      const qty = Number(a.quantity) || 1;
      totalFronts += qty;
      totalHeight += Number(a.height) * qty;
    });

    const drawersQty = (order.drawerArticles || [])
      .reduce((sum, a) => sum + (Number(a.quantity) || 1), 0);

    const hasOnlyHighMedPair = () => {
      if (drawersQty !== 2) return false;

      const hasHigh45 = order.drawerArticles.some(a =>
        a.group4 === filter.Interior.group4.high &&
        Number(a.depth) === 45
      );

      const hasMedOrLow37 = order.drawerArticles.some(a =>
        Number(a.depth) === 37 &&
        (
          a.group4 === filter.Interior.group4.medium ||
          a.group4 === filter.Interior.group4.low
        )
      );

      return hasHigh45 && hasMedOrLow37;
    };

    const hasSinkVariant = () => {
      if (drawersQty !== 2) return false;

      const hasHigh45 = order.drawerArticles.some(a =>
        a.group4 === filter.Interior.group4.high &&
        Number(a.depth) === 45
      );

      const has37Valid = order.drawerArticles.some(a =>
        Number(a.depth) === 37 &&
        (
          a.group4 === filter.Interior.group4.medium ||
          a.group4 === filter.Interior.group4.low
        )
      );

      return hasHigh45 && has37Valid;
    };

    // -------------------------
    // 🔥 HÖGPRIORITET: NYA REGLER
    // -------------------------
    const customCaseA =
      totalFronts === 2 &&
      totalHeight === 80 &&
      (isHobFan || isSink) &&
      hasOnlyHighMedPair();

    const customCaseB =
      totalFronts === 3 &&
      totalHeight === 80 &&
      isHobFan &&
      hasOnlyHighMedPair();

    const customCaseC =
      totalFronts === 3 &&
      totalHeight === 80 &&
      isSink &&
      hasSinkVariant();

    let status = "🚫\nIngen kontroll";

    if (customCaseA || customCaseB || customCaseC) {
      status = "✅";
    }

    else if (
      totalFronts === 2 &&
      totalHeight === 80 &&
      (isHobFan || isSink)
    ) {
      status = "❌";
    }

    else if (
      totalFronts === 3 &&
      totalHeight === 80 &&
      isHobFan
    ) {
      status = "❌";
    }

    else if (
      totalFronts === 3 &&
      totalHeight === 80 &&
      isSink
    ) {
      status = "❌";
    }
    else if(isSink){
      status = "🚫\nIngen kontroll"
    }

    // =========================
    // HINGE (endast om ingen custom rule matchar)
    // =========================
    else if (hasHinge) {
      status = "🚫\nIngen kontroll";
    }

    // =========================
    // HÄLL / STANDARD
    // =========================
    else {

      const isMatch = (list, combo) =>
        list.some(arr =>
          arr.length === combo.length &&
          arr.every((v, i) => v === combo[i])
        );

      const list3F = [[1,2,0],[2,2,0],[1,1,1],[1,3,0],[0,3,0],[2,0,1],[3,0,1],[2,1,0],[0,3,1],[3,2,0],[5,1,0],[4,1,0]];
      const list2F = [[1,2,0],[2,2,0],[1,1,1],[1,3,0],[0,3,0],[0,2,0],[0,1,1],[0,1,2]];

      const list3F_Hob = [[1,2,0],[2,2,0],[0,1,1],[0,3,0],[2,0,1],[2,1,0],[0,2,1],[4,1,0],[3,1,0]];
      const list2F_Hob = [[1,2,0],[2,2,0],[0,1,1],[0,3,0],[0,2,0],[0,1,2],[0,2,1]];
      const list1F_Hob = [[0,1,0]];

      // 🆕 NYA LISTOR
      const list1F20 = [[1,0,0], [0,0,1]];
      const list1F40 = [[0,1,0], [1,1,0], [0,1,1]];
      const list2F60 = [[1,1,0], [1,0,1], [0,2,0], [1,2,0], [2,1,0], [3,1,0]];

      const affectingArticles = (order.allArticles || []).filter(a =>
        a.artNr === "102.432.96" ||
        a.artNr === "302.432.95"
      );

      const hasHall = affectingArticles.length > 0;

      if (hasHall) {
        if (totalFronts === 3 && totalHeight === 80) {
          status = isMatch(list3F_Hob, combo) ? "❌" : "✅";
        }
        else if (totalFronts === 2 && totalHeight === 80) {
          status = isMatch(list2F_Hob, combo) ? "❌" : "✅";
        }

        else if (totalFronts === 1 && totalHeight === 20) {
          status = isMatch(list1F_Hob, combo) ? "❌" : "✅";
        }

        else if (totalFronts === 1 && totalHeight === 40) {
          status = isMatch(list1F40, combo) ? "❌" : "✅";
        }

        else if (totalFronts === 2 && totalHeight === 60) {
          status = isMatch(list2F60, combo) ? "❌" : "✅";
        }

      } else {

        if (totalFronts === 3 && totalHeight === 80) {
          status = isMatch(list3F, combo) ? "❌" : "✅";
        }
        else if (totalFronts === 2 && totalHeight === 80) {
          status = isMatch(list2F, combo) ? "❌" : "✅";
        }

        // =========================
        // 🆕 NYA FALL
        // =========================
        else if (totalFronts === 1 && totalHeight === 20) {
          status = isMatch(list1F20, combo) ? "❌" : "✅";
        }

        else if (totalFronts === 1 && totalHeight === 40) {
          status = isMatch(list1F40, combo) ? "❌" : "✅";
        }

        else if (totalFronts === 2 && totalHeight === 60) {
          status = isMatch(list2F60, combo) ? "❌" : "✅";
        }

      }
    }

    return {
      ...order,
      combo,
      totalFronts,
      totalHeight,
      status,
      ruleTriggers,
      hingeArticles 
    };

  });

  const anyError = headers.some(h => h.status === "❌");
  const allOkOrIgnored = headers.every(h =>
    h.status === "✅" ||
    h.status === "🚫\nIngen kontroll"
  );

  let globalStatus = "🟩";

  if (headers.length === 0) globalStatus = "🟩";
  else if (anyError) globalStatus = "🟥";
  else if (allOkOrIgnored) globalStatus = "🟩";
  else globalStatus = "🟥";

  return {
    headers,
    globalStatus
  };
}