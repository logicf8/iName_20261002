import { filter } from '../../../../../core/shared/global/myConstants.js';
import { SCALE } from '../config/cabinetConfig.js';
import { getCabinetEmoji } from '../utils/cabinetEmoji.js';

export function createCabinetBox({
  header,
  originalIndex,
  itemX,
  cabinetBottomPx,
  itemWidthPx,
  rawHeightPx,
  type,
  container,
  headers,
  renderCabinetsFn
}) {
  const isHigh = type === filter.Cabinet.group2.High;
  const isTop = type === filter.Cabinet.group2.Top;
  const isBase = type === filter.Cabinet.group2.Base;
  const isWall = type === filter.Cabinet.group2.Wall;
  const isDummy = !!header.isDummy;
  
  // Kontrollera via antingen proxyns flagga eller direkt på objektet
  const isCornerBase = header.isCornerBase || header.owner === "Nedre hörn" || header.rawType === "Nedre hörn";

  const box = document.createElement('div');
  box.className = 'cabinet-box';
  if (isDummy) {
    box.classList.add('dummy-box');
    box.dataset.isDummy = 'true';
  }
  box.dataset.index = originalIndex;
  box.dataset.id = isDummy ? 'dummy' : (header.number || header.id || (originalIndex + 1));
  box.dataset.type = type;
  box.dataset.group = header.group !== undefined && header.group !== null ? String(header.group).trim() : '';

  if (isWall) box.classList.add('wall-cabinet');
  if (isHigh) box.classList.add('tall-cabinet');

  box.style.position = 'absolute';
  box.style.left = `${itemX}px`;
  box.style.bottom = `${cabinetBottomPx}px`;
  box.style.width = `${itemWidthPx}px`;
  box.style.height = `${rawHeightPx}px`;
  box.style.border = '1px solid #000000';
  box.style.boxSizing = 'border-box';
  box.style.backgroundColor = isDummy ? '#e0e0e0' : '#ffffff';
  box.style.userSelect = 'none';
  box.style.cursor = 'grab';

  // Skapa element för nummer
  const label = document.createElement('span');
  label.textContent = isDummy ? 'dummy' : (header.number ? `${header.number}` : `#${originalIndex + 1}`);
  label.style.fontWeight = 'bold';
  label.style.fontSize = `${Math.max(12, 14 * SCALE)}px`;

  // Skapa element för emoji (Tvinga in 📐 om det är ett hörnskåp)
  const emoji = !isDummy ? (isCornerBase ? '📐' : getCabinetEmoji(header)) : null;
  let emojiLabel = null;
  if (emoji) {
    emojiLabel = document.createElement('span');
    emojiLabel.className = 'cabinet-emoji';
    emojiLabel.textContent = emoji;
    emojiLabel.style.fontSize = `${Math.max(10, 12 * SCALE)}px`;
    emojiLabel.style.lineHeight = '1.1';
    emojiLabel.style.userSelect = 'none';
    emojiLabel.style.pointerEvents = 'none';
  }

  // Skapa element för mått
  const dimLabel = document.createElement('span');
  dimLabel.style.fontSize = `${Math.max(6, 6.5 * SCALE)}px`;
  dimLabel.style.color = '#666';
  dimLabel.style.textAlign = 'center';
  dimLabel.style.lineHeight = '1.1';
  dimLabel.style.whiteSpace = 'nowrap';
  dimLabel.style.maxWidth = '100%';
  dimLabel.style.overflow = 'hidden';

  const normalText = isDummy ? `${header.width}x88` : `${header.width}x${header.depth}x${header.height}`;
  dimLabel.innerHTML = normalText;

  // Containrar positioneras exakt i topp, mitten och botten
  const topContainer = document.createElement('div');
  topContainer.style.position = 'absolute';
  topContainer.style.top = '2px';
  topContainer.style.left = '0';
  topContainer.style.right = '0';
  topContainer.style.display = 'flex';
  topContainer.style.flexDirection = 'column';
  topContainer.style.alignItems = 'center';

  const middleContainer = document.createElement('div');
  middleContainer.style.position = 'absolute';
  middleContainer.style.top = '50%';
  middleContainer.style.left = '0';
  middleContainer.style.right = '0';
  middleContainer.style.transform = 'translateY(-50%)';
  middleContainer.style.display = 'flex';
  middleContainer.style.flexDirection = 'column';
  middleContainer.style.alignItems = 'center';

  const bottomContainer = document.createElement('div');
  bottomContainer.style.position = 'absolute';
  bottomContainer.style.bottom = '2px';
  bottomContainer.style.left = '0';
  bottomContainer.style.right = '0';
  bottomContainer.style.display = 'flex';
  bottomContainer.style.flexDirection = 'column';
  bottomContainer.style.alignItems = 'center';

  if (isDummy) {
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-dummy-btn';
    removeBtn.textContent = '✕';
    removeBtn.title = 'Ta bort dummy och beräkna om';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.border = '1px solid #888';
    removeBtn.style.backgroundColor = '#ffffff';
    removeBtn.style.color = '#cc0000';
    removeBtn.style.fontWeight = 'bold';
    removeBtn.style.borderRadius = '3px';
    removeBtn.style.fontSize = `${Math.max(9, 10 * SCALE)}px`;
    removeBtn.style.lineHeight = '1';
    removeBtn.style.padding = '1px 4px';
    removeBtn.style.zIndex = '10';

    removeBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = headers.indexOf(header);
      if (idx !== -1) {
        headers.splice(idx, 1);
      }
      headers.forEach(h => delete h._offsetX);

      if (typeof renderCabinetsFn === 'function') {
        renderCabinetsFn();
      }
    });

    middleContainer.appendChild(removeBtn);
  }

  if (isTop || isWall) {
    topContainer.appendChild(dimLabel);
    if (emojiLabel) middleContainer.appendChild(emojiLabel);
    bottomContainer.appendChild(label);
  } else if (isHigh) {
    bottomContainer.appendChild(dimLabel);

    const wallHeader = headers && headers.find(h => h.type === filter?.Cabinet?.group2?.Wall);
    const wallHeight = wallHeader ? wallHeader.height : 80;

    let wallTopY = 228;
    if (wallHeight === 100) {
      wallTopY = 248;
    } else if (wallHeight <= 60) {
      wallTopY = 208;
    }

    const wallBottomPx = (wallTopY * SCALE) - (wallHeight * SCALE);
    const numberBottomPx = wallBottomPx + 2 - cabinetBottomPx;

    const highNumberContainer = document.createElement('div');
    highNumberContainer.style.position = 'absolute';
    highNumberContainer.style.bottom = `${numberBottomPx}px`;
    highNumberContainer.style.left = '0';
    highNumberContainer.style.right = '0';
    highNumberContainer.style.display = 'flex';
    highNumberContainer.style.flexDirection = 'column';
    highNumberContainer.style.alignItems = 'center';
    highNumberContainer.appendChild(label);
    box.appendChild(highNumberContainer);

    if (emojiLabel) {
      const baseHeightPx = 80 * SCALE;
      const topOffset = (rawHeightPx - baseHeightPx) + 2 + Math.max(12, 14 * SCALE);

      const highEmojiContainer = document.createElement('div');
      highEmojiContainer.style.position = 'absolute';
      highEmojiContainer.style.top = `${topOffset}px`;
      highEmojiContainer.style.left = '0';
      highEmojiContainer.style.right = '0';
      highEmojiContainer.style.display = 'flex';
      highEmojiContainer.style.flexDirection = 'column';
      highEmojiContainer.style.alignItems = 'center';
      highEmojiContainer.appendChild(emojiLabel);
      box.appendChild(highEmojiContainer);
    }
  } else if (isBase) {
    topContainer.appendChild(label);
    if (emojiLabel) topContainer.appendChild(emojiLabel);

    // Om det är ett hörnskåp lägger vi till inputfälten i bottomContainer ovanför dimLabel
    if (isCornerBase) {
      const inputsWrapper = document.createElement('div');
      inputsWrapper.style.display = 'flex';
      inputsWrapper.style.flexDirection = 'column';
      inputsWrapper.style.gap = '1px';
      inputsWrapper.style.alignItems = 'center';
      inputsWrapper.style.marginBottom = '2px';

      const leftRow = document.createElement('div');
      leftRow.style.display = 'flex';
      leftRow.style.alignItems = 'center';
      leftRow.style.gap = '3px';

      const leftLabel = document.createElement('span');
      leftLabel.textContent = 'Vä:';
      leftLabel.style.fontSize = `${Math.max(7, 8.5 * SCALE)}px`;
      leftLabel.style.color = '#333';

      const leftInput = document.createElement('input');
      leftInput.type = 'number';
      leftInput.value = header.leftValue !== undefined ? header.leftValue : 75;
      leftInput.style.width = '2.8ch';
      leftInput.style.fontSize = `${Math.max(7, 8.5 * SCALE)}px`;
      leftInput.style.textAlign = 'center';
      leftInput.style.padding = '1px';
      leftInput.style.border = '1px solid #ccc';
      leftInput.style.borderRadius = '2px';

      leftInput.addEventListener('mousedown', (e) => e.stopPropagation());
      leftInput.addEventListener('change', (e) => {
        header.leftValue = parseFloat(e.target.value) || 75;
      });

      leftRow.appendChild(leftLabel);
      leftRow.appendChild(leftInput);

      const rightRow = document.createElement('div');
      rightRow.style.display = 'flex';
      rightRow.style.alignItems = 'center';
      rightRow.style.gap = '3px';

      const rightLabel = document.createElement('span');
      rightLabel.textContent = 'Hö:';
      rightLabel.style.fontSize = `${Math.max(7, 8.5 * SCALE)}px`;
      rightLabel.style.color = '#333';

      const rightInput = document.createElement('input');
      rightInput.type = 'number';
      rightInput.value = header.rightValue !== undefined ? header.rightValue : 75;
      rightInput.style.width = '2.8ch';
      rightInput.style.fontSize = `${Math.max(7, 8.5 * SCALE)}px`;
      rightInput.style.textAlign = 'center';
      rightInput.style.padding = '1px';
      rightInput.style.border = '1px solid #ccc';
      rightInput.style.borderRadius = '2px';

      rightInput.addEventListener('mousedown', (e) => e.stopPropagation());
      rightInput.addEventListener('change', (e) => {
        header.rightValue = parseFloat(e.target.value) || 75;
      });

      rightRow.appendChild(rightLabel);
      rightRow.appendChild(rightInput);

      inputsWrapper.appendChild(leftRow);
      inputsWrapper.appendChild(rightRow);

      bottomContainer.appendChild(inputsWrapper);
    }

    bottomContainer.appendChild(dimLabel);
  }

  box.appendChild(topContainer);
  box.appendChild(middleContainer);
  box.appendChild(bottomContainer);

  requestAnimationFrame(() => {
    if (dimLabel.scrollWidth > box.clientWidth - 4) {
      dimLabel.innerHTML = isDummy ? `${header.width}<br>x<br>88` : `${header.width}<br>x<br>${header.depth}<br>x<br>${header.height}`;
    }
  });

  const groupInput = document.createElement('input');
  groupInput.type = 'text';
  groupInput.maxLength = 2;
  groupInput.className = 'group-num-input';
  groupInput.value = header.group !== undefined ? header.group : '';
  groupInput.style.position = 'absolute';
  
  const offsetPx = 21 * SCALE;

  if (isWall || isTop) {
    groupInput.style.bottom = `-${offsetPx}px`;
  } else if (isHigh) {
    const baseHeightPx = 80 * SCALE;
    const inputTopPx = (rawHeightPx - baseHeightPx) - offsetPx;
    groupInput.style.top = `${inputTopPx}px`;
  } else {
    groupInput.style.top = `-${offsetPx}px`;
  }

  groupInput.style.left = '50%';
  groupInput.style.transform = 'translateX(-50%)';
  groupInput.style.width = '1.8ch';
  groupInput.style.boxSizing = 'content-box';
  groupInput.style.padding = '1px 3px';
  groupInput.style.fontSize = `${Math.max(8, 10 * SCALE)}px`;
  groupInput.style.textAlign = 'center';
  groupInput.style.borderRadius = '3px';
  groupInput.style.border = '1px solid #ccc';

  groupInput.addEventListener('change', (e) => {
    header.group = e.target.value.trim();
    headers.forEach(h => delete h._offsetX);
    if (typeof renderCabinetsFn === 'function') {
      renderCabinetsFn();
    }
  });

  box.appendChild(groupInput);
  return box;
}