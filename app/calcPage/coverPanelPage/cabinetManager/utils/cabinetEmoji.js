//app\calcPage\coverPanelPage\utils\cabinetEmoji.js
import { filter } from '../../../../../core/shared/global/myConstants.js';

export function getCabinetEmoji(header) {
  if (!header) return '';

  const constructorName = header.constructor?.name;
  const emojis = [];

  // 1. CombinationHeader
  if (constructorName === 'CombinationHeader' || constructorName === "CoverPanelHeader") {
    if (header.corner === true || header.corner135 === true) {
      emojis.push('📐');
    }

    const flags = header.forFlags || {};

    if (flags.sink) {
      emojis.push('💧');
    }

    if (flags.hob || flags.hobFan) {
      emojis.push('♨️');
    }

    if (flags.oven || flags.combiMicro || flags.compactOven || flags.micro) {
      emojis.push('🌡️');
    }

    if (flags.fridgeOrF) {
      emojis.push('❄️');
    }

    if (flags.fan) {
      emojis.push('🏠💨');
    }
  }

  // 2. CombinationFreeStanding
  if (constructorName === 'CombinationFreeStanding') {
    const rawType = header.rawType || header.type;

    const isDishW = rawType === filter.Appliance.group2.Dishwasher;
    const isWasherD = rawType === filter.Appliance.group2.WasherDryer;
    
    const ffGroup3 = header.group3;
    const ffHeight = String(header.height);
    const isFridgeF = (rawType === filter.Appliance.group2.Fridge && ffGroup3 === filter.Appliance.group3.FreeStanding && ffHeight === "80");

    if (isDishW) {
      emojis.push('🍽️');
    } else if (isWasherD) {
      emojis.push('👚');
    } else if (isFridgeF) {
      emojis.push('❄️');
    }
  }

  return emojis.join(' ');
}