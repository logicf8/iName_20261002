//app\calcPage\susRailCalc\index.js
import { createSusRailUI } from './ui/renderSusRail.js';
import { setupSusRailEvents } from './events/susRailEvents.js';

// Ändra default-ID till 'susRailContainer' som finns i index.html
export function initSusRailCalc(parentContainerId = 'susRailContainer') {
  const parentContainer = document.getElementById(parentContainerId);
  
  // Guard clause – avbryt om containern inte finns i DOM:en ännu
  if (!parentContainer) return;

  // Skapa container för upphängningsskenan om den inte redan finns
  let susContainer = document.getElementById('susRailCalculator');
  if (!susContainer) {
    susContainer = document.createElement('div');
    susContainer.id = 'susRailCalculator';
    parentContainer.appendChild(susContainer);
  }

  // Rendera UI och koppla händelser
  createSusRailUI(susContainer);
  setupSusRailEvents(susContainer);
}