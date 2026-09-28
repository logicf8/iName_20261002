export const wallPanelCfg = {
    infoKey: "wpInfo",
    label: "Väggplatta",

    header: {
        singular: "Måttbeställd väggplatta",
        plural: "Måttbeställda väggplattor",
        singularPC: "Väggplatta - Färdig längd",
        pluralPC: "Väggplatta - Färdiga längder",
        buildSingleTxt: art =>
            ` - ${art.description}, ${art.color}`
    },

    priceByColor: () => " Pris per m²",

    getDimension() {
        return "MMMM x MMMM mm";
    }
};
