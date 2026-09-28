/**
 * Analyserar och berikar ett CoverPanelHeader-objekt baserat på textinnehållet i raden.
 * @param {CoverPanelHeader} header - Det nyskapade header-objektet
 * @param {string} line - Textraden från IKEA-listan (t.ex. "1. Passbit för bänkskåp")
 */
export function extractCoverPanelOrFittingPieceData(header, line) {
  const lowerLine = line.toLowerCase();

  // 1. Identifiera Owner (Väggskåp, Bänkskåp, Högskåp, Halvhöga skåp, Nedre hörn)
  // Vi mappar sökord till önskat format med stor begynnelsebokstav
  const ownerMap = {
    "bänkskåp": "Bänkskåp",
    "väggskåp": "Väggskåp",
    "högskåp": "Högskåp",
    "halvhöga skåp": "Halvhöga skåp",
    "nedre hörn": "Nedre hörn"
  };

  for (const [key, value] of Object.entries(ownerMap)) {
    if (lowerLine.includes(key)) {
      header.owner = value;
      break; // Avbryt vid första matchning (t.ex. bänkskåp)
    }
  }

  // 2. Sätt flaggor baserat på specifika kombinationer av ord
  if (lowerLine.includes("passbit")) {
    header.fittingPice = true;

    if (lowerLine.includes("innertak")) {
      header.ceilingFittingPice = true;
    }
    
    if (lowerLine.includes("nedre hörn")) {
      header.cornerFittingPice = true;
      header.width = "67.5"
      header.depth = "67.5"
    }
  }

  if (lowerLine.includes("täcksida") || lowerLine.includes("cover panel")) {
    header.coverPanel = true;
  }
}