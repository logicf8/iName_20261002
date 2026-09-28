//app\calcPage\coverPanelPage\cabinetManager\utils\cabinetHelpers.js
import { filter } from '../../../../../core/shared/global/myConstants.js';

export function getCabinetType(box) {
  const type = box.dataset.type;
  if (box.classList.contains('wall-cabinet') || type === 'wall' || type === filter.Cabinet.group2.Wall || type === filter.Cabinet.group2.Top) return 'wall';
  if (box.classList.contains('tall-cabinet') || type === 'tall' || type === filter.Cabinet.group2.High) return 'tall';
  return 'base';
}