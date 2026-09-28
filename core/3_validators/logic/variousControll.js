import { filter } from "../../shared/global/myConstants.js";

export function variousControll(sectionPortfolio) {

  const articles = sectionPortfolio.getAllArticles();

  // ----------------------
  // Räknare (status-logik)
  // ----------------------
  let handleCount = 0;
  let hasTemplate = false;

  let fridgeCount = 0;
  let freezerCount = 0;

  let hasFan = false;
  let hasPipe = false;

  let hasDiffArticle = false;

  let coldTotalCount = 0;
  let ventGrillCount = 0;

  let intColdCount = 0;
  let ventSockelCount = 0;

  let freeApplianceCount = 0;
  let floorProtCount = 0;
  let specialFloorProtCount = 0;

  let hobNeedCount = 0;
  let hobProtectionCount = 0;

  let sinkNeedCount = 0;
  let shelfCoverCount = 0;
  let sealingCount = 0;

  let sinkOneCount = 0;
  let sinkTwoCount = 0;

  let waterTrapOneCount = 0; // 103.115.39
  let waterTrapTwoCount = 0; // 903.115.40
  let sinkCoverCount = 0;    // 203.178.52

  let waterTrapArticles = [];
  let sinkCoverArticles2 = [];
  let sinkArticlesType = [];

  let builtInNeedCount = 0;
  let builtInOkCount = 0;

  let builtInGroups = [];
  let builtInFlagArticles = [];

  let dishwasherDrawerNeedCount = 0;
  let dishwasherDrawerOkCount = 0;

  let dishwasherDrawerFrontArticles = [];
  let dishwasherBracketArticles = [];

  // ----------------------
  // Arrayer (visning)
  // ----------------------
  let handleArticles = [];
  let templateArticles = [];

  let coldArticles = [];

  let fanArticles = [];
  let pipeArticles = [];

  let diffArticles = [];

  let ventGrillArticles = [];
  let coldAllArticles = [];

  let sockelArticles = [];
  let intColdArticles = [];

  let floorArticles = [];
  let freeApplianceArticles = [];

  let hobNeedArticles = [];
  let hobProtectionArticles = [];

  let sinkNeedArticles = [];
  let shelfCoverArticles = [];
  let sealingArticles = [];

  // ----------------------
  // LOOP
  // ----------------------
  articles.forEach(article => {

    const qty = article.quantity || 0;

    // 🔹 Handtag
    if (
      filter.HandelsKnobs.group1 === article.group1 &&
      (
        filter.HandelsKnobs.group2.Handels === article.group2 ||
        filter.HandelsKnobs.group2.Knobs === article.group2
      )
    ) {
      handleCount += qty;
      handleArticles.push(article);
    }

    // 🔹 Borrmall
    if (article.artNr === "903.233.93") {
      hasTemplate = true;
      templateArticles.push(article);
    }

    // 🔹 Kyl/Frys
    if (
      filter.Appliance.group1 === article.group1 &&
      filter.Appliance.group2.Fridge === article.group2
    ) {
      coldArticles.push(article);

      if (filter.Appliance.group4.Fridge === article.group4) {
        fridgeCount += qty;
      }

      if (filter.Appliance.group4.Freezer === article.group4) {
        freezerCount += qty;
      }
    }

    // 🔹 Fläkt
    if (
      filter.Appliance.group1 === article.group1 &&
      filter.Appliance.group2.Fan === article.group2
    ) {
      hasFan = true;
      fanArticles.push(article);
    }

    // 🔹 Rör
    if (
      article.artNr === "600.899.85" ||
      article.artNr === "902.502.59"
    ) {
      hasPipe = true;
      pipeArticles.push(article);
    }

    // 🔹 Diff
    if (article.artNr === "006.135.42") {
      hasDiffArticle = true;
      diffArticles.push(article);
    }

    // 🔹 Alla kyl/frys
    if (
      filter.Appliance.group1 === article.group1 &&
      filter.Appliance.group2.Fridge === article.group2 &&
      article.group4 !== "N/A" &&
      article.group4 !== "Golvskydd"
    ) {
      coldTotalCount += qty;
      coldAllArticles.push(article);
    }

    // 🔹 Ventilationsgaller
    if (article.artNr === "702.561.77") {
      ventGrillCount += qty;
      ventGrillArticles.push(article);
    }

    // 🔹 Integrerade
    if (
      filter.Appliance.group1 === article.group1 &&
      filter.Appliance.group2.Fridge === article.group2 &&
      filter.Appliance.group3.IntFridge === article.group3 &&
      article.group4 !== "N/A" &&
      article.group4 !== "Golvskydd"
    ) {
      intColdCount += qty;
      intColdArticles.push(article);
    }

    // 🔹 Sockel
    if (article.artNr === "302.214.58" || article.artNr === "402.930.77" || article.artNr === "305.685.76") {
      ventSockelCount += qty;
      sockelArticles.push(article);
    }

    // 🔹 Fristående kyl/frys
    if (
      filter.Appliance.group1 === article.group1 &&
      filter.Appliance.group2.Fridge === article.group2 &&
      filter.Appliance.group3.FreeStanding === article.group3 &&
      article.group4 !== "N/A"
    ) {
      freeApplianceCount += qty;
      freeApplianceArticles.push(article);
    }

    // 🔹 Fristående diskmaskin
    if (
      filter.Appliance.group1 === article.group1 &&
      filter.Appliance.group2.Dishwasher === article.group2 &&
      filter.Appliance.group3.FreeStanding === article.group3
    ) {
      freeApplianceCount += qty;
      freeApplianceArticles.push(article);
    }

    // 🔹 Golvskydd
    if (article.artNr === "402.819.94") {
      floorProtCount += qty;
      floorArticles.push(article);
    }

    if (article.artNr === "705.348.53") {
      specialFloorProtCount += qty;
      floorArticles.push(article);
    }

    // 🔹 Hällskydd
    if (
      article.group1 === filter.Appliance.group1 &&
      article.group2 === filter.Appliance.group2.Accessories &&
      article.group3 === filter.Appliance.group3.Hob &&
      article.group4 === filter.Appliance.group4.HobSafety
    ) {
      hobProtectionCount += qty;
      hobProtectionArticles.push(article);
    }

    // 🔹 Hyllplansskydd (ShelfCover)
    if (
      article.group1 === filter.Sink.group1 &&
      article.group2 === filter.Sink.group2.Accessories &&
      article.group3 === filter.Sink.group3.ShelfCover
    ) {
      shelfCoverCount += qty;
      shelfCoverArticles.push(article);
    }

    // 🔹 Tätning (Sealing)
    if (
      article.group1 === filter.Sink.group1 &&
      article.group2 === filter.Sink.group2.Accessories &&
      article.group3 === filter.Sink.group3.Sealing
    ) {
      sealingCount += qty;
      sealingArticles.push(article);
    }

    // 🔹 Diskho (ej tillbehör)
    if (
      article.group1 === filter.Sink.group1 &&
      article.group2 !== filter.Sink.group2.Accessories
    ) {
      sinkArticlesType.push(article);

      if (article.group4 === "En") {
        sinkOneCount += qty;
      }

      if (article.group4 === "Två") {
        sinkTwoCount += qty;
      }
    }

    // 🔹 Vattenlås
    if (article.artNr === "103.115.39") {
      waterTrapOneCount += qty;
      waterTrapArticles.push(article);
    }

    if (article.artNr === "903.115.40") {
      waterTrapTwoCount += qty;
      waterTrapArticles.push(article);
    }

    // 🔹 Lock
    if (article.artNr === "203.178.52") {
      sinkCoverCount += qty;
      sinkCoverArticles2.push(article);
    }

  });

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name === "CombinationHeader") {

      if (
        header.forFlags.hob === true &&
        header.forFlags.oven === false &&
        header.forFlags.compactOven === false
      ) {
        hobNeedCount++;

        header.returnArticles().forEach(article => {
          if (
            article.group1 === filter.Appliance.group1 &&
            article.group2 === filter.Appliance.group2.Hob &&
            article.group3 === "N/A"
          ) {
            hobNeedArticles.push(article);
          }
        });
      }

      if (header.constructor.name === "CombinationHeader") {

        let hasTriggerArticle = false;
        let groupArticles = [];

        header.returnArticles().forEach(article => {

          if (
            article.group1 === filter.Appliance.group1 &&
            article.group2 === filter.Appliance.group2.Fan &&
            article.group3 === filter.Appliance.group3.FanType
          ) {
            hasTriggerArticle = true;
            groupArticles.push(article);
          }

          if (
            article.group1 === filter.Appliance.group1 &&
            article.group2 === filter.Appliance.group2.Hob
          ) {
            hasTriggerArticle = true;
            groupArticles.push(article);
          }

          if (
            article.group1 === filter.Appliance.group1 &&
            article.group2 === filter.Appliance.group2.Oven
          ) {
            hasTriggerArticle = true;
            groupArticles.push(article);
          }

          if (
            article.group1 === filter.Appliance.group1 &&
            article.group2 === filter.Appliance.group2.CompactOven
          ) {
            hasTriggerArticle = true;
            groupArticles.push(article);
          }

          if (
            article.group1 === filter.Appliance.group1 &&
            article.group2 === filter.Appliance.group2.Fridge &&
            article.group3 === filter.Appliance.group3.IntFridge
          ) {
            hasTriggerArticle = true;
            groupArticles.push(article);
          }

          if (
            article.group1 === filter.Sink.group1 &&
            article.group2 === filter.Sink.group2.Sink
          ) {
            hasTriggerArticle = true;
            groupArticles.push(article);
          }

        });

        if (hasTriggerArticle) {
          builtInNeedCount++;

          if (groupArticles.length) {
            builtInGroups.push(groupArticles);
          }

          if (header.builtIn === true || header.forFlags.fan === true || header.forFlags.sink === true) {
            builtInOkCount++;

            builtInFlagArticles.push({
              name: header.type,
              description: `${header.builtIn ? "inb." : "fläkt"} ${header.width}x${header.depth}x${header.height}`,
              quantity: 1
            });
          }
        }

      }

      if (header.constructor.name === "CombinationHeader") {

        // 🔹 Diskho finns
        if (header.forFlags.sink === true) {

          sinkNeedCount++;

          // 🔹 Spara artiklar kopplade till denna diskho
          header.returnArticles().forEach(article => {
            if (
              article.group1 === filter.Sink.group1 &&
              article.group2 === filter.Sink.group2.Sink
            ) {
              sinkNeedArticles.push(article);
            }
          });
        }
      }
    }

    // 🔹 Fristående diskmaskin kräver beslag om lådfront finns
    if (
      header.constructor.name === "CombinationFreeStanding" &&
      header.description === filter.Appliance.group2.Dishwasher
    ) {

      let drawerFrontCount = 0;
      let hasBracket = false;

      header.returnArticles().forEach(article => {

        const qty = article.quantity || 0;

        // 🔹 Räkna lådfronter
        if (
          article.group1 === filter.Fronts.group1 &&
          article.group2 === filter.Fronts.group2.DrawerFront
        ) {
          drawerFrontCount += qty;
          dishwasherDrawerFrontArticles.push(article);
        }

        // 🔹 Kontrollera beslag
        if (article.artNr === "005.181.92") {
          hasBracket = true;
          dishwasherBracketArticles.push(article);
        }

      });

      // 🔹 Om lådfront finns behövs beslag
      if (drawerFrontCount > 0) {

        dishwasherDrawerNeedCount++;

        if (hasBracket) {
          dishwasherDrawerOkCount++;
        }
      }
    }

  });

  // ----------------------
  // RESULTAT
  // ----------------------

  let handleStatus = "-";

  if (handleCount > 0) {
    handleStatus = hasTemplate ? "✅" : "❌";
  }

  let fridgeStatus = "-";
  const totalCold = fridgeCount + freezerCount;

  if (totalCold > 0) {
    fridgeStatus =
      (fridgeCount <= 1 && freezerCount <= 1) ? "✅" : "❌";
  }

  let fanStatus = "-";

  if (hasFan || hasPipe) {
    fanStatus = (hasFan && hasPipe) ? "✅" : "❌";
  }

  let diffStatus = "-";

  if (sectionPortfolio.needDiff === true) {
    diffStatus = hasDiffArticle ? "✅" : "❌";
  }

  let ventStatus = "-";

  if (coldTotalCount > 0) {
    ventStatus = (coldTotalCount === ventGrillCount) ? "✅" : "❌";
  }

  let sockelStatus = "-";

  if (intColdCount > 0) {
    sockelStatus = (intColdCount === ventSockelCount) ? "✅" : "❌";
  }

  let floorStatus = "-";

  if (freeApplianceCount > 0) {

    if (specialFloorProtCount > 1) {
      floorStatus = "❌";
    } else {
      const totalFloor = floorProtCount + specialFloorProtCount;
      floorStatus = (totalFloor === freeApplianceCount) ? "✅" : "❌";
    }
  }

  let hobStatus = "-";

  if (hobNeedCount > 0) {
    hobStatus = (hobNeedCount === hobProtectionCount) ? "✅" : "❌";
  }

  let sinkStatus = "-";

  if (sinkNeedCount > 0) {

    const okShelf = shelfCoverCount === sinkNeedCount;
    const okSealing = sealingCount === sinkNeedCount;

    sinkStatus = (okShelf && okSealing) ? "✅" : "❌";
  }

  let sink2Status = "-";

  const totalSinks = sinkOneCount + sinkTwoCount;

  if (totalSinks > 0) {

    const needWaterTrapOne = sinkOneCount;
    const needWaterTrapTwo = sinkTwoCount;

    const needCovers =
      (sinkOneCount * 1) +
      (sinkTwoCount * 2);

    const okWaterTrap =
      waterTrapOneCount === needWaterTrapOne &&
      waterTrapTwoCount === needWaterTrapTwo;

    const okCovers =
      sinkCoverCount === needCovers;

    sink2Status = (okWaterTrap && okCovers) ? "✅" : "❌";
  }

  let builtInStatus = "-";

  if (builtInNeedCount > 0) {
    builtInStatus =
      (builtInNeedCount === builtInOkCount) ? "✅" : "❌";
  }

  let dishwasherDrawerStatus = "-";

  if (dishwasherDrawerNeedCount > 0) {
    dishwasherDrawerStatus =
      dishwasherDrawerNeedCount === dishwasherDrawerOkCount
        ? "✅"
        : "❌";
  }

  const statuses = [
    handleStatus,
    fridgeStatus,
    fanStatus,
    diffStatus,
    ventStatus,
    sockelStatus,
    floorStatus,
    hobStatus,
    sinkStatus,
    sink2Status,
    builtInStatus,
    dishwasherDrawerStatus
  ];

  // Alla ❌
  const errorStatuses = statuses.filter(s => s === "❌");

  // Specialfall: endast borrmall fel
  const onlyHandleError =
    errorStatuses.length === 1 &&
    handleStatus === "❌";

  const dynamicText =
    onlyHandleError
      ? "🟧 ⚠️ Endast borrmall ⚠️"
      : errorStatuses.length > 0
        ? "🟥 ⚠️ Artikel- fel ⚠️"
        : "🟩 Inget uppenbart fel";

  const format = (arr, fn) => {

    if (!arr.length) return "-";

    const map = new Map();

    arr.forEach(item => {

      const key = fn(item);

      // 🔥 Viktigt: quantity kan vara undefined, 0 eller >1
      const qty = Number(item.quantity) || 1;

      map.set(key, (map.get(key) || 0) + qty);

    });

    return Array.from(map.entries())
      .map(([text, count]) =>
        count > 1 ? `${text} (${count} st)` : text
      )
      .join("\n");
  };

  const formatGroups = (groups) => {

    if (!groups.length) return "-";

    return groups
      .map(group => {
        const text = format(group, a => `${a.name} ${a.description}`);
        return `[${text}]`;
      })
      .join("\n");
  };

  return {

    handle: {
      status: handleStatus,
      col1: handleArticles.length
        ? format(handleArticles, a => `${a.name} ${a.group2}`)
        : "-",
      col2: handleArticles.length
        ? format(templateArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    fridge: {
      status: fridgeStatus,
      col1: coldArticles.length
        ? format(coldArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: "-"
    },

    fan: {
      status: fanStatus,
      col1: fanArticles.length
        ? format(fanArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: fanArticles.length
        ? format(pipeArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    diff: {
      status: diffStatus,
      col1: sectionPortfolio.needDiff ? "Ugn finns i bänkskåp" : "-",
      col2: sectionPortfolio.needDiff
        ? format(diffArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    vent: {
      status: ventStatus,
      col1: coldAllArticles.length
        ? format(coldAllArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: coldAllArticles.length
        ? format(ventGrillArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    sockel: {
      status: sockelStatus,
      col1: intColdArticles.length
        ? format(intColdArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: intColdArticles.length
        ? format(sockelArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    floor: {
      status: floorStatus,
      col1: freeApplianceArticles.length
        ? format(freeApplianceArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: freeApplianceArticles.length
        ? format(floorArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    hob: {
      status: hobStatus,
      col1: hobNeedArticles.length
        ? format(hobNeedArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: hobProtectionArticles.length
        ? format(hobProtectionArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    sink: {
      status: sinkStatus,
      col1: sinkNeedArticles.length
        ? format(sinkNeedArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: (shelfCoverArticles.length || sealingArticles.length)
        ? [
            format(shelfCoverArticles, a => `${a.name} ${a.description}`),
            format(sealingArticles, a => `${a.name} ${a.description}`)
          ].join("\n")
        : "-"
    },

    sink2: {
      status: sink2Status,
      col1: sinkArticlesType.length
        ? format(sinkArticlesType, a => `${a.name} ${a.description}`)
        : "-",
      col2: (waterTrapArticles.length || sinkCoverArticles2.length)
        ? [
            format(waterTrapArticles, a => `${a.name} ${a.description}`),
            format(sinkCoverArticles2, a => `${a.name} ${a.description}`)
          ].join("\n")
        : "-"
    },

    builtIn: {
      status: builtInStatus,
      col1: formatGroups(builtInGroups),
      col2: builtInFlagArticles.length
        ? format(builtInFlagArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    dishwasherDrawer: {
      status: dishwasherDrawerStatus,
      col1: dishwasherDrawerFrontArticles.length
        ? format(dishwasherDrawerFrontArticles, a => `${a.name} ${a.description}`)
        : "-",
      col2: dishwasherBracketArticles.length
        ? format(dishwasherBracketArticles, a => `${a.name} ${a.description}`)
        : "-"
    },

    dynamicText
  };
}