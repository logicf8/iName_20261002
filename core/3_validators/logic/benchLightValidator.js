import { filter } from '../../shared/global/myConstants.js';

export function benchLightTypeWidth(sectionPortfolio) {

  const wallType = filter.Cabinet.group2.Wall;

  const headers = [];
  const allArticleKeys = [];
  let globalError = null;
  let hasMissing = false;
  let hasAnyLighting = false;

  sectionPortfolio.returnHeaders().forEach(header => {

    if (header.constructor.name !== "CombinationHeader" && header.constructor.name !== "OpenHeader") return;

    // Endast väggskåp + ej fan-flag
    if (header.type !== wallType || header.forFlags?.fan === true) {
      return;
    }

    const order = {
      header: header.number,
      type: header.type,
      width: header.width,
      depth: header.depth,
      height: header.height,
      cabinet: `${header.width} cm`,
      status: "missing",
      articles: []
    };

    let hasFan = false;

    // -----------------------------
    // Hämta artiklar
    // -----------------------------
    const benchArticles = header.returnArticles().filter(article => {

      // Fläkt → skip hela headern
      if (
        article.group1 === filter.Appliance.group1 &&
        article.group2 === filter.Appliance.group2.Fan &&
        article.group3 === "Inbyggd"
      ) {
        hasFan = true;
      }

      return (
        article.group1 === filter.Light.group1 &&
        article.group2 === filter.Light.group2.benchLighting
      );
    });

    if (hasFan) return;

    if (benchArticles.length > 0) {
      hasAnyLighting = true;
    }
    // -----------------------------
    // ANALYS PER HEADER
    // -----------------------------

    const isCorner =
      header.corner === true &&
      Number(header.width) === 68;

    const totalQty = benchArticles.reduce(
      (sum, a) => sum + (Number(a.quantity) || 1),
      0
    );

    const allWidth40 = benchArticles.every(
      a => Number(a.width) === 40
    );

    // ==========================
    // ⭐ HÖRNLOGIK (MÅSTE KÖRAS FÖRST)
    // ==========================
    if (isCorner) {

      if (benchArticles.length === 0) {
        order.status = "missing";
        hasMissing = true;
      }
      else if (allWidth40 && totalQty === 2) {
        order.status = "correct";
      } 
      else if (!allWidth40) {
        order.status = "wrong width";
        globalError = "wrong width";
      } 
      else {
        order.status = "wrong quantity";
        globalError = "wrong quantity";
      }

    }

    // ==========================
    // VANLIGT SKÅP
    // ==========================
    else {

      if (benchArticles.length === 0) {
        order.status = "missing";
        hasMissing = true;
      }

      else if (benchArticles.length === 1) {
        const a = benchArticles[0];

        if (
          Number(a.width) === Number(header.width) &&
          (Number(a.quantity) || 1) === 1
        ) {
          order.status = "correct";
        } 
        else if (Number(a.width) !== Number(header.width)) {
          order.status = "wrong width";
          globalError = "wrong width";
        } 
        else {
          order.status = "wrong quantity";
          globalError = "wrong quantity";
        }
      }

      else {
        order.status = "wrong quantity";
        globalError = "wrong quantity";
      }

    }

    // -----------------------------
    // Spara artiklar
    // -----------------------------
    benchArticles.forEach(a => {

      const key = `${a.name}, ${a.color}`;
      allArticleKeys.push(key);

      order.articles.push({
        name: a.name,
        color: a.color,
        width: a.width,
        watt: a.group3,
        quantity: Number(a.quantity) || 1
      });
    });

    headers.push(order);

  });

  // -----------------------------
  // ORDER STATUS (hela köket)
  // -----------------------------
  const unique = [...new Set(allArticleKeys)];

  let orderStatus = "🟩 Nej";

  if (globalError === "wrong width") {
    orderStatus = "🟥 ⚠️ Fel bredd ⚠️";
  } 
  else if (globalError === "wrong quantity") {
    orderStatus = "🟥 ⚠️ Fel antal ⚠️";
  } 
  else if (hasAnyLighting && hasMissing) {
    orderStatus = "🟥 ⚠️ Saknas ⚠️";
  }
  else if (!hasAnyLighting) {
    orderStatus = "🟢 Nej";
  }
  else if (unique.length === 1) {
    orderStatus = `🟩 Alla, ${unique[0]}`;
  } 
  else if (unique.length > 1) {
    orderStatus = "🟥 Blandad belysning";
  }

  // -----------------------------
  // BILD
  // -----------------------------
  let pic = "bench_lights_mixed.png";

  if (unique.length === 1) {
    const val = unique[0].toLowerCase();

    if (val.includes("mittled") && val.includes("vit")) {
      pic = "mittled_white.avif";
    } else if (val.includes("mittled") && val.includes("alu")) {
      pic = "mittled_alu.avif";
    } else if (val.includes("irsta") && val.includes("opalvit")) {
      pic = "irsta.avif";
    }
  }

  return {
    headers,
    orderStatus,
    pic
  };
}