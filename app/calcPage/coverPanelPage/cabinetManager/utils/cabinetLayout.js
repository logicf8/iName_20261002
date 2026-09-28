//app\calcPage\coverPanelPage\utils\cabinetLayout.js
import { filter } from '../../../../../core/shared/global/myConstants.js';
import { SCALE, BASE_RECT_HEIGHT } from '../config/cabinetConfig.js';

export function calculateCabinetBottomPx(header, type, rawHeightPx) {
  const isHigh = type === filter.Cabinet.group2.High;
  const isTop = type === filter.Cabinet.group2.Top;
  const isBase = type === filter.Cabinet.group2.Base;
  const isWall = type === filter.Cabinet.group2.Wall;

  if (isHigh || isBase) {
    return BASE_RECT_HEIGHT;
  }

  if (isWall || isTop) {
    let topY;

    if (isWall) {
      if (header.height === 100) {
        topY = 248;
      } else if (header.height === 80) {
        topY = 228;
      } else if (header.height <= 60) {
        topY = 208;
      }
    } else if (isTop) {
      if (header.height === 60) {
        topY = 248;
      } else if (header.height === 40) {
        topY = 228;
      }
    }

    if (topY === undefined) {
      topY = 228;
    }

    const topYPx = topY * SCALE;
    return topYPx - rawHeightPx;
  }

  return 0;
}