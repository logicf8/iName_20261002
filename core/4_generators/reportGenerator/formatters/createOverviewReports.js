//core\4_generators\reportGenerator\formatters\createOverviewReports.js
function formatSEK(value) {
  return new Intl.NumberFormat(
    'sv-SE',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(value);
}

export function createOverviewReports(sectionPortfolio) {
  if (
    sectionPortfolio.countArtFlag.cabinets >= 6 &&
    sectionPortfolio.countArtFlag.appliance >= 4 &&
    sectionPortfolio.priceFlag.pFronts > 0
  ) {
    const discountedFrontPrice = sectionPortfolio.priceFlag.pFronts * 0.15;

    sectionPortfolio.reportTxts.push({
      title: "🔥 Kampanj 🔥",
      text1: `💵 Rabatt: ${formatSEK(discountedFrontPrice)} kr`,
      text2: "",
      info: "Uppfyller kravet: minst 6 stommar och 4 vitvaror (15% rabatt på fronter)"
    });
  }


  if (
    sectionPortfolio.priceFlag.totPrice > 0 &&
    sectionPortfolio.countArtFlag.totArt > 0
  ) {

    sectionPortfolio.reportTxts.push({
      title: "Order totalt",
      text1: `💰 Pris: ${formatSEK(sectionPortfolio.priceFlag.totPrice)} kr`,
      text2: `🛒 Antal: ${sectionPortfolio.countArtFlag.totArt} st`,
      info: "Avser artikelvärde som kommer att importeras"
    });
  }

  if (
    sectionPortfolio.countArtFlag.cabinets > 0 &&
    sectionPortfolio.priceFlag.pCabinets > 0
  ) {

    sectionPortfolio.reportTxts.push({
      title: "Stommar",
      text1: `💵 Pris: ${formatSEK(sectionPortfolio.priceFlag.pCabinets)} kr`,
      text2: `🧺 Antal: ${sectionPortfolio.countArtFlag.cabinets} st`,
      info: "Avser Metod, Tornviken och Vadholma"
    });

  }

  if (
    sectionPortfolio.countArtFlag.appliance > 0 &&
    sectionPortfolio.priceFlag.pAppliances > 0
  ) {

    sectionPortfolio.reportTxts.push({
      title: "Vitvaror",
      text1: `💵 Pris: ${formatSEK(sectionPortfolio.priceFlag.pAppliances)} kr`,
      text2: `🧺 Antal: ${sectionPortfolio.countArtFlag.appliance} st`,
      info: "Avser vitvaror utan tillbehör. Kan därav diffa emot nKP"
    });

  }

  if (
    sectionPortfolio.countArtFlag.fronts > 0 &&
    sectionPortfolio.priceFlag.pFronts > 0
  ) {

    sectionPortfolio.reportTxts.push({
      title: "Fronter",
      text1: `💵 Pris: ${formatSEK(sectionPortfolio.priceFlag.pFronts)} kr`,
      text2: `🧺 Antal: ${sectionPortfolio.countArtFlag.fronts} st`,
      info: "Avser yttre dörrar och lådfronter"
    });

  }
}
