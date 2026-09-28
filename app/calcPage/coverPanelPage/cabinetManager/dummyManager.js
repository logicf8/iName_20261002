import { filter } from '../../../../core/shared/global/myConstants.js';

export class DummyHeader {
  constructor(width) {
    this.isDummy = true;
    this.width = Number(width) || 15;
    this.height = 88; // 88 px/cm höjd utan separat sockel
    this.depth = 60;
    this.type = filter.Cabinet.group2.Base; // Ligger på bänkskåpsspåret
    this.group = '';
    this.number = ''; // Ingen egen numrering
  }
}

export function handleAddDummy(headers, reRenderFn) {
  const input = prompt('Ange bredd för Dummy (cm):', '15');
  if (input === null) return; // Användaren avbröt dialogen

  const width = parseFloat(input.trim());
  if (isNaN(width) || width <= 0) {
    alert('Vänligen ange en giltig bredd.');
    return;
  }

  const dummy = new DummyHeader(width);
  headers.push(dummy);
  if (typeof reRenderFn === 'function') {
    reRenderFn();
  }
}