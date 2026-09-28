//C:\PRIVAT\MinaProgram\iName\DisplayTxtCreate\customMadeConfigs\workTopCfg.js
export const workTopCfg = {
  infoKey: "wtInfo",
  label: "Bänkskiva",

  header: {
    singular: "Måttbeställd bänkskiva",
    plural: "Måttbeställda bänkskivor",
    singularPC: "Bänkskiva - Färdig längd",
    pluralPC: "Bänkskivor - Färdiga längder",
    buildSingleTxt: art =>
      ` - ${art.name} ${art.description}, ${art.color}`
  },

  priceByColor: color =>
    (color === "laminat" || color === "faner")
      ? " Pris per löpmeter"
      : " Pris per m²",

  getDimension(a) {
     const length = Math.round(a.quantity * 1000);

    switch (a.group3) {
      case "30-45":
        return `Bänkskiva - ${length} x 411 mm`;
      case "45.1-63.5":
        return `Bänkskiva - ${length} x 635 mm`;
      case "63.6-125":
        return `Bänkskiva - ${length} x 890 mm`;
      default:
        return `Bänkskiva - MMM x 635 mm`;
    }
  }
};