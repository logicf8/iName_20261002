import { filter } from '../shared/global/myConstants.js'

export function artForFlagAdd(header) {
  if ((header.type === filter.Cabinet.group2.Base || header.type === filter.Cabinet.group2.Wall)) {
    
    // Mapping mellan forFlags-nyckel och motsvarande text från filter.Appliance.group2
    const flagMapping = {
      oven: filter.Appliance.group2.Oven.toLowerCase(),
      compactOven: filter.Appliance.group2.CompactOven.toLowerCase(),
      combiMicro: filter.Appliance.group2.CombiMicro.toLowerCase(),
      micro: filter.Appliance.group2.Micro.toLowerCase(),
      hob: filter.Appliance.group2.Hob.toLowerCase(),
      hobFan: "häll med fläkt",
      fan: filter.Appliance.group2.Fan.toLowerCase(),
      sink: filter.Sink.group2.Sink.toLowerCase()
    };

    // Leta upp den flagga som är true och sätt header.forFlagTxt
    for (const [key, text] of Object.entries(flagMapping)) {
      if (header.forFlags[key] === true) {
        header.forFlagTxt = text;
        break;
      }
    }

  }
}