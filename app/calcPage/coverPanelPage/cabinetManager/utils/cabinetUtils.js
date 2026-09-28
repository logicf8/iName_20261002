//app\calcPage\coverPanelPage\cabinetManager\utils\cabinetUtils.js
import { filter } from '../../../../../core/shared/global/myConstants.js';
import { GROUP_GAP, SCALE } from '../config/cabinetConfig.js';

export function optimizeUngroupedItems(ungroupedItems) {
  // Använd filter-konstanterna för att kategorisera/verifiera om det behövs
  const bases = ungroupedItems.filter(item => item.header.type === filter.Cabinet.group2.Base);
  const walls = ungroupedItems.filter(item => item.header.type === filter.Cabinet.group2.Wall);
  const others = ungroupedItems.filter(item => 
    item.header.type !== filter.Cabinet.group2.Base && 
    item.header.type !== filter.Cabinet.group2.Wall
  );

  // Returnera skåpen i sin ursprungliga ordning så att grupperingen inte kastar om ordningen
  return ungroupedItems;
}

// Global eller sparad referens för framtida åtkomst
export const savedGroupRanges = {};

// Hjälpfunktion för att översätta skåptyp till läsbart format för subgruppering
function getReadableCabinetType(box) {
  const type = box.dataset.type;

  // Matcha mot dina definierade typer i myConstants.js
  if (type === filter.Cabinet.group2.High) return 'Högskåp';
  if (type === filter.Cabinet.group2.Top) return 'Överskåp';
  if (type === filter.Cabinet.group2.Wall) return 'Väggskåp';
  if (type === filter.Cabinet.group2.Base) return 'Bänkskåp';

  // Fallback om type av någon anledning skulle saknas eller vara gammalt format
  if (box.classList.contains('tall-cabinet') || type === 'tall') return 'Högskåp';
  if (box.classList.contains('wall-cabinet') || type === 'wall') return 'Väggskåp';
  return 'Bänkskåp';
}

export function logGroups(container) {
  const wrappers = Array.from(container.querySelectorAll('.cover-panel-grid'));
  if (wrappers.length === 0) return;

  // Rensa gamla sparade intervall
  Object.keys(savedGroupRanges).forEach(key => delete savedGroupRanges[key]);

  const physicalGroups = [];

  // Loopa igenom varje enskild "rad"/container
  wrappers.forEach(wrapper => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const boxes = Array.from(wrapper.querySelectorAll('.cabinet-box'));

    if (boxes.length === 0) return;

    // Sortera boxarna efter deras faktiska visuella X-position inom sin EGEN rad
    boxes.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      const diffX = (rectA.left - wrapperRect.left) - (rectB.left - wrapperRect.left);
      if (Math.abs(diffX) > 0.5) {
        return diffX;
      }
      const idxA = parseInt(a.dataset.index, 10);
      const idxB = parseInt(b.dataset.index, 10);
      return idxA - idxB;
    });

    let currentGroup = null; // MÅSTE vara reset per ny rad

    boxes.forEach((box) => {
      const rect = box.getBoundingClientRect();
      const leftX = Math.round(rect.left - wrapperRect.left);
      const rightX = Math.round(rect.right - wrapperRect.left);
      const boxId = box.dataset.id;
      const boxGroup = box.dataset.group;
      const readableType = getReadableCabinetType(box);

      // Spara ner all data om varje enskilt skåp för att kunna subgruppera senare
      const cabinetData = {
        id: boxId,
        type: readableType,
        startX: leftX,
        endX: rightX
      };

      if (!currentGroup) {
        currentGroup = {
          startX: leftX,
          endX: rightX,
          cabinets: [boxId],
          items: [cabinetData], // Sparar detaljer om ingående skåp
          group: boxGroup
        };
      } else {
        const gap = leftX - currentGroup.endX;
        const isDifferentGroupAttr = boxGroup !== undefined && boxGroup !== null && boxGroup !== '' && 
                                     currentGroup.group !== undefined && currentGroup.group !== null && currentGroup.group !== '' && 
                                     boxGroup !== currentGroup.group;

        // Skapa en ny grupp om det finns ett avstånd mellan skåp/grupper eller om gruppnummer från input skiljer sig
        if (gap >= GROUP_GAP - (10 * SCALE) || isDifferentGroupAttr || gap > (15 * SCALE)) {
          physicalGroups.push(currentGroup);
          currentGroup = {
            startX: leftX,
            endX: rightX,
            cabinets: [boxId],
            items: [cabinetData],
            group: boxGroup
          };
        } else {
          // Utöka nuvarande grupp
          currentGroup.endX = Math.max(currentGroup.endX, rightX);
          currentGroup.cabinets.push(boxId);
          currentGroup.items.push(cabinetData);
        }
      }
    });

    if (currentGroup) {
      physicalGroups.push(currentGroup);
    }
  });

  console.log("--- Grupperingsresultat & X-intervall ---");
  
  physicalGroups.forEach((grp, index) => {
    const groupName = `Grupp ${index + 1}`;
    
    // ----- BERÄKNA SUBGRUPPER -----
    const subGroups = [];
    const activeSubs = {}; // Håller koll på pågående subgrupp PER typ samtidigt

    grp.items.forEach(item => {
      const active = activeSubs[item.type];

      // Om det finns en aktiv subgrupp av samma typ och de ligger nära/överlappar (glapp <= 15px)
      if (active && (item.startX - active.endX) <= (15 * SCALE)) {
        // Utöka befintlig subgrupp
        active.endX = Math.max(active.endX, item.endX);
        active.cabinets.push(item.id);
      } else {
        // Starta en helt ny subgrupp för denna typ
        const newSub = {
          type: item.type,
          startX: item.startX,
          endX: item.endX,
          cabinets: [item.id]
        };
        subGroups.push(newSub);
        // Sätt den nya subgruppen som den för tillfället aktiva för den typen
        activeSubs[item.type] = newSub; 
      }
    });

    // Sortera subgrupperna vänster till höger så listan känns logisk
    subGroups.sort((a, b) => {
      if (a.startX === b.startX) {
        return a.type.localeCompare(b.type); // Skiljer dem åt alfabetiskt om de startar exakt samtidigt
      }
      return a.startX - b.startX;
    });
    // -------------------------------

    // Spara huvudgruppen och dess subgrupper i det globala objektet
    savedGroupRanges[groupName] = {
      startX: grp.startX,
      endX: grp.endX,
      cabinets: grp.cabinets,
      subGroups: subGroups
    };

    // Konsolutskrift för huvudgrupp
    console.log(`${groupName} -> Start X: ${grp.startX}px, Slut X: ${grp.endX}px (${grp.cabinets.length})`, grp.cabinets);
    
    // Konsolutskrift för subgrupper
    subGroups.forEach((sub, subIdx) => {
      console.log(`${groupName}, SubGrupp${subIdx + 1}, ${sub.type} -> Start X: ${sub.startX}px, Slut X: ${sub.endX}px (${sub.cabinets.length})`, sub.cabinets);
    });
  });

  return savedGroupRanges;
}