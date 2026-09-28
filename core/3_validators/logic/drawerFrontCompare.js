import { filter } from "../../shared/global/myConstants.js";

// -----------------------------------------------------
// COLLECT
// -----------------------------------------------------
export function collectDrawerFrontData(sectionPortfolio) {
  const orders = [];

  sectionPortfolio.returnHeaders().forEach(header => {
    if (header.constructor.name !== "CombinationHeader") return;
    const order = {
        header: header.number,
        type: header.type,
        width: header.width,
        depth: header.depth,
        height: header.height,
        isSink: header.forFlags?.sink === true,
        isOven: header.forFlags?.oven === true,
        isCompactOven: header.forFlags?.compactOven === true, 
        isHobFan: header.forFlags?.hobFan === true,
        isWorkSerface: header.withFlags?.workSerfaces > 0,
        drawers: [],
        outerFronts: [],
        innerFronts: [],
        pullOuts: [],
        doors: [],
        correctionArticles: []
      };

    header.returnArticles().forEach(article => {
      const qty = Number(article.quantity) || 1;

      // ✅ KORRIGERANDE ARTIKLAR
      if (
        article.artNr === "602.635.88" ||
        article.artNr === "106.041.13"
      ) {
        order.correctionArticles.push({
          artNr: article.artNr,
          description: `[K.skena → KoppladYF ${order.width}x20 (1)]`,
          quantity: qty
        });
      }
      if (article.artNr === "202.699.31") {
        order.hasDoorOnDrawerRule = (order.hasDoorOnDrawerRule || 0) + qty;
      }

      if (
        article.group1 === filter.Interior.group1 &&
        article.group2 === filter.Interior.group2.Drawer &&
        article.group3 === filter.Interior.group3.PullOut
      ) {
        order.pullOuts.push({ article, quantity: qty, matched: false });
      }

      if (
        article.group1 === filter.Fronts.group1 &&
        article.group2 === filter.Fronts.group2.Door &&
        article.group3 !== filter.Fronts.group3.GlassDoor
      ) {
        order.doors.push({ article, quantity: qty });
      }

      if (
        article.group1 === filter.Interior.group1 &&
        article.group2 === filter.Interior.group2.Drawer &&
        article.group3 === filter.Interior.group3.Drawer &&
        [40, 60, 80].includes(Number(article.width))
      ) {
        order.drawers.push({ article, quantity: qty, remaining: qty });
      }

      if (
        article.group1 === filter.Fronts.group1 &&
        article.group2 === filter.Fronts.group2.DrawerFront
      ) {
        order.outerFronts.push({ article, quantity: qty, available: qty });
      }

      if (
        article.group1 === filter.Interior.group1 &&
        article.group2 === filter.Interior.group2.Drawer &&
        article.group3 === filter.Interior.group3.InnerDrawerFront
      ) {
        order.innerFronts.push({ article, quantity: qty });
      }
      if (
        article.group1 === filter.FrontAccessories.group1 &&
        article.group2 === filter.FrontAccessories.group2.Hinges &&
        article.group3 === filter.FrontAccessories.group3.Horizontal
      ) {
      order.hingeHorizontalQty = (order.hingeHorizontalQty || 0) + qty;
      }
    });

const hasData =
  order.drawers.length ||
  order.pullOuts.length ||
  order.outerFronts.length ||
  order.innerFronts.length; // ✅ lägg till dessa

if (hasData) orders.push(order);
  });

  return orders;
}

// -----------------------------------------------------
// ANALYZE ORDER
// -----------------------------------------------------
export function analyzeDrawerFrontOrder(order) {
  let status = "OK";

  let drawerCount = 0;
  let outerCount = 0;
  let innerCount = 0;
  let correctionCount = 0;

  const correctionItems = [];
  const drawerItems = [];
  const outerItems = [];
  const innerItems = [];
  const matchItems = [];
  const matchRows = [];

  // -------------------
  // DRAWERS
  // -------------------
  order.drawers.forEach(d => {
    const a = d.article;
    drawerCount += d.quantity;

    drawerItems.push({
      name: a.name,
      group3: a.group3,
      width: Number(a.width),
      depth: Number(a.depth),
      level: a.group4,
      quantity: d.quantity
    });
  });

  // -------------------
  // PULLOUTS
  // -------------------
  order.pullOuts.forEach(p => {
    const a = p.article;

    // -------------------
    // Räkna som låda
    // -------------------
    drawerCount += p.quantity;

    drawerItems.push({
      name: a.name,
      group3: "Utdrag",
      width: Number(a.width),
      depth: null,
      level: "80", // visuellt (dörrhöjd)
      quantity: p.quantity,
      isPullOut: true
    });

    // -------------------
    // Hitta matchande dörr
    // -------------------
    const matchDoor = order.doors.find(d =>
      Number(d.article.width) === Number(a.width) &&
      Number(d.article.height) === 80
    );

    if (matchDoor) {
      outerCount += matchDoor.quantity;

      outerItems.push({
        group2: "Dörr",
        width: Number(matchDoor.article.width),
        height: Number(matchDoor.article.height),
        quantity: matchDoor.quantity
      });
    }
  });

  // -------------------
  // OUTER
  // -------------------
  order.outerFronts.forEach(o => {
    const a = o.article;

    let effectiveQty = o.quantity;
    if (Number(a.height) === 10) effectiveQty *= 2;

    outerCount += effectiveQty;

    outerItems.push({
      group2: a.group2,
      width: Number(a.width),
      height: Number(a.height),
      quantity: o.quantity
    });
      o.available = effectiveQty;
  });
  // -----------------------------------------------------
  // HOB FAN CHECK (2x20 + 1x40)
  // -----------------------------------------------------
  if (order.isHobFan) {

    const total20 = order.outerFronts
      .filter(o => Number(o.article.height) === 20)
      .reduce((sum, o) => sum + o.quantity, 0);

    const total40 = order.outerFronts
      .filter(o => Number(o.article.height) === 40)
      .reduce((sum, o) => sum + o.quantity, 0);

    order.hasHobFanCombination3 = (total20 >= 2 && total40 >= 1);
  }
  // -----------------------------------------------------
  // HOB FAN CHECK (2x40)
  // -----------------------------------------------------
  if (order.isHobFan) {

    const total40 = order.outerFronts
      .filter(o => Number(o.article.height) === 40)
      .reduce((sum, o) => sum + o.quantity, 0);

    order.hasHobFanCombination2 = (total40 >= 2);
  }
  // -------------------
  // INNER
  // -------------------
  order.innerFronts.forEach(i => {
    const a = i.article;

    innerCount += i.quantity;

    innerItems.push({
      name: a.name,
      width: Number(a.width),
      level: a.group4,
      quantity: i.quantity
    });
  });

  // -----------------------------------------------------
  // APPLY HOB FAN INNER CORRECTION (2x40 -> remove 1 inner 20)
  // -----------------------------------------------------
  if (order.isHobFan && order.hasHobFanCombination2) {

    let remainingToRemove = 1;

    for (const i of order.innerFronts) {
      if (remainingToRemove <= 0) break;

      if (i.article.group4 === filter.Interior.group4.medium && i.quantity > 0) {

        i.quantity -= 1;
        remainingToRemove -= 1;

        correctionCount += 1;

        correctionItems.push({
          text: `[HällFläkt2D → BlindIF ${order.width}x20 (1)]`
        });

        break; // vi ska bara ta bort 1
      }
    }

    if (remainingToRemove > 0) {
      console.log(`[HobFan INNER] Ingen inner 20 att reducera`);
    }
  }
  // -----------------------------------------------------
  // INNER MATCH
  // -----------------------------------------------------
  const remainingDrawers = order.drawers.map(d => ({ ...d }));

  order.innerFronts.forEach(i => {
    const a = i.article;
    let qty = i.quantity;

    const targetName = a.name === "UTRUSTA" ? "UTRUSTA" : a.name;

    while (qty > 0) {
      const match = remainingDrawers.find(d =>
        ((d.article.name === targetName) || (targetName === "UTRUSTA" && d.article.name === "MAXIMERA")) &&
        Number(d.article.width) === Number(a.width) &&
        d.article.group4 === a.group4 &&
        d.remaining > 0
      );

      if (!match) {
        status = "LOW";
        matchRows.push(`Inre front saknas för ${a.name}`);
        break;
      }

      const used = Math.min(match.remaining, qty);

      matchItems.push({
        type: "inner",
        drawer: {
          name: match.article.name,
          width: Number(match.article.width),
          level: match.article.group4
        },
        front: {
          name: a.name,
          width: Number(a.width),
          level: a.group4
        },
        quantity: used
      });

      match.remaining -= used;
      qty -= used;
    }
  });

  // -----------------------------------------------------
  // APPLY DOOR ON DRAWER RULE (202.699.31)
  // -----------------------------------------------------
if (order.hasDoorOnDrawerRule) {

  let remaining = order.hasDoorOnDrawerRule;

  for (const d of remainingDrawers) { // ✅ FIX
    if (remaining <= 0) break;

    if (
      d.article.group4 === filter.Interior.group4.high &&
      d.remaining > 0
    ) {

      const matchDoor = order.doors.find(door =>
        Number(door.article.width) === Number(d.article.width) &&
        Number(door.article.height) === 60 &&
        door.quantity > 0
      );

      if (matchDoor) {

        const used = Math.min(d.remaining, matchDoor.quantity, remaining);

        d.remaining -= used;
        matchDoor.quantity -= used;

        outerCount += used;

        outerItems.push({
          group2: "Dörr",
          width: Number(matchDoor.article.width),
          height: Number(matchDoor.article.height),
          quantity: used
        });

        remaining -= used;

        //correctionCount += used;

        correctionItems.push({
          text: `[DÖrrPåLåda → ${order.width}x60 (${used})]`
        });
      }
    }
  }


    if (remaining > 0) {
      console.log(`[DoorOnDrawer] Kunde inte matcha alla (${remaining} kvar)`);
    }
  }

  const leftoverDrawers = remainingDrawers.filter(d => d.remaining > 0);
  // -----------------------------------------------------
  // APPLY CORRECTION ARTICLES
  // -----------------------------------------------------
  if (order.correctionArticles.length > 0) {

    order.correctionArticles.forEach(c => {

      let remaining = c.quantity;

      while (remaining > 0) {

        const target = order.outerFronts.find(o =>
          Number(o.article.height) === 20 && o.available > 0
        );

        if (!target) {
          console.log(`[Correction] Ingen 20-front att reducera`);
          break;
        }

        target.available -= 1;
        remaining -= 1;

        correctionCount += 1; // ✅ räkna varje förbrukning

      }

      correctionItems.push({
        text: c.description
      });

    });
  }
  // -----------------------------------------------------
  // APPLY SINK CORRECTION (BLINDFRONT)
  // -----------------------------------------------------
  if (order.isSink) {

    // Försök först hitta en 20-front
    let target = order.outerFronts.find(o =>
      Number(o.article.height) === 20 && o.available > 0
    );

    if (target) {
      target.available -= 1;
      correctionCount += 1;
      correctionItems.push({ text: `[HO → BlindYF ${order.width}x20 (1)]` });
    } else {
      // Om ingen 20 finns, kolla om minst två 10-fronts finns
      const tenTargets = order.outerFronts.filter(o =>
        Number(o.article.height) === 10 && o.available > 0
      );

      // Summera totalt antal tillgängliga 10-fronts
      const totalTenAvailable = tenTargets.reduce((sum, o) => sum + o.available, 0);

      if (totalTenAvailable >= 2) {
        let remainingToUse = 2;
        for (const t of tenTargets) {
          const used = Math.min(t.available, remainingToUse);
          t.available -= used;
          remainingToUse -= used;
          if (remainingToUse <= 0) break;
        }

        correctionCount += 2;
        correctionItems.push({ text: `[Havsen → BlindYF ${order.width}x10 (2)]` });
      } else {
        console.log(`[Sink] Ingen front att reducera för Blindfront`);
      }
    }
  }
  // -----------------------------------------------------
  // APPLY OVEN / COMPACT OVEN CORRECTION (BLINDFRONT)
  // -----------------------------------------------------
  if (order.isOven || order.isCompactOven) {

    const target = order.outerFronts.find(o =>
      Number(o.article.height) === 10 && o.available > 0
    );

    if (target) {

      target.available -= 1;

      correctionCount += 1;

      correctionItems.push({
        text: `[UgnH40 → BlindYT ${order.width}x10 (1)]`
      });
    }

  }
  // -----------------------------------------------------
  // APPLY HOB FAN CORRECTION
  // -----------------------------------------------------
  if (order.isHobFan && order.hasHobFanCombination3) {

    let target = order.outerFronts.find(o =>
      Number(o.article.height) === 20 && o.available > 0
    );

    if (target) {
      target.available -= 1;

      correctionCount += 1;

      correctionItems.push({
        text: `[HällFläkt3D → BlindYF ${order.width}x20 (1)]`
      });

    } else {
      console.log(`[HobFan] Ingen 20-front att reducera`);
    }
  }
  // -----------------------------------------------------
  // APPLY HINGE HORIZONTAL CORRECTION
  // -----------------------------------------------------
if (order.hingeHorizontalQty) {

  let remaining = order.hingeHorizontalQty;

  while (remaining > 0) {

    const target = order.outerFronts.find(o =>
      Number(o.article.height) === 40 && o.available > 0
    );

    if (!target) {
      console.log(`[HingeHorizontal] Ingen 40-front att reducera`);
      break;
    }

    target.available -= 1;
    remaining -= 1;

    correctionCount += 1;
  }

  correctionItems.push({
    text: `[Horr.gångjärn → "Dörr" ${order.width}x40 (${order.hingeHorizontalQty})]`
  });

}
  // -----------------------------------------------------
  // OUTER MATCH
  // -----------------------------------------------------
  const priority = {
    [filter.Interior.group4.high]: 0,
    [filter.Interior.group4.medium]: 1,
    [filter.Interior.group4.low]: 2
  };

    leftoverDrawers.sort((a, b) =>
    priority[a.article.group4] - priority[b.article.group4]
  );

  const sortedOuter = order.outerFronts
    .slice()
    .sort((a, b) => Number(b.article.height) - Number(a.article.height));

  leftoverDrawers.forEach(d => {
  const a = d.article;
  let needed = d.remaining;

  let preferredHeights = [];
  if (a.group4 === filter.Interior.group4.high) preferredHeights = [40];
  else if (a.group4 === filter.Interior.group4.medium) preferredHeights = [40, 20];
  else if (a.group4 === filter.Interior.group4.low) preferredHeights = [10, 20];

  for (const height of preferredHeights) {
    if (needed <= 0) break;

    const candidates = sortedOuter.filter(o =>
      Number(o.article.width) === Number(a.width) &&
      Number(o.article.height) === height &&
      o.available > 0
    );

    candidates.forEach(o => {
      if (needed <= 0) return;

      let available = o.available;
      if (Number(o.article.height) === 10) available *= 2;

      const used = Math.min(needed, available);

      matchItems.push({
        type: "outer",
        drawer: {
          name: a.name,
          width: Number(a.width),
          level: a.group4
        },
        front: {
          width: Number(o.article.width),
          height: Number(o.article.height)
        },
        quantity: used
      });

      needed -= used;

      if (Number(o.article.height) === 10) {
        o.available -= Math.ceil(used / 2);
      } else {
        o.available -= used;
      }
    }); // candidates.forEach
  } // for-of height
  
  if (needed > 0) {
    status = "LOW";
    matchRows.push(`Yttre front saknas för ${a.name}`);
  }
  
});

  // -----------------------------------------------------
  // WORK SURFACE OVERRIDE (60x10 = OK)
  // -----------------------------------------------------
  if (order.isWorkSerface) {

    const workSurfaceMatch = order.outerFronts.find(o =>
      Number(o.article.height) === 10 &&
      Number(o.article.width) === 60 &&
      o.available > 0
    );

    // Vi kollar att det "bara är denna typ som orsakar problem"
    const onlyWorkSurfaceLeft =
      workSurfaceMatch &&
      order.outerFronts.filter(o =>
        o.available > 0 &&
        !(Number(o.article.height) === 10 && Number(o.article.width) === 60)
      ).length === 0;

    if (onlyWorkSurfaceLeft) {

      workSurfaceMatch.available -= 1;

      correctionCount += 1;

      correctionItems.push({
        text: `[Arbetsyta → "Lådfront 60x10"]`
      });

      status = "OK";

    }
  }



  // -----------------------------------------------------
  // PULLOUT CHECK
  // -----------------------------------------------------
  order.pullOuts.forEach(p => {
    const matchDoor = order.doors.find(d =>
      Number(d.article.width) === Number(p.article.width) &&
      Number(d.article.height) === 80
    );

    if (!matchDoor) {
      status = "LOW";
      matchRows.push(`PullOut utan dörr`);
    } else {
      p.matched = true;
    }
  });

  // -----------------------------------------------------
  return {
    header: order.header,
    type: order.type,
    width: order.width,
    depth: order.depth,
    height: order.height,
    drawerItems,
    outerItems,
    innerItems,
    matchItems,
    matchRows,
    correctionItems,
    drawerCount,
    outerCount,
    innerCount,
    correctionCount,
    result: outerCount + innerCount - drawerCount - correctionCount,
    status
  };
}

// -----------------------------------------------------
// ANALYZE ALL
// -----------------------------------------------------
export function analyzeDrawerFronts(orders) {
  const headers = orders.map(o => analyzeDrawerFrontOrder(o));

  const allOK = headers.every(h => h.status === "OK");
  const sameCount = headers.every(h => h.result === 0);

  let globalStatus = "OK";

  if (!sameCount) globalStatus = "COUNT";
  else if (!allOK) globalStatus = "FRONT";

  return {
    headers,
    globalStatus
  };
}