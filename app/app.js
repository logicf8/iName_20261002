//app\app.js
// 1. Globala/orkestrerande händelser (pageControl)
import { setupThemeEvents } from './pageControl/events/themeEvents.js';
import { setupViewEvents } from './pageControl/events/viewEvents.js';

// 2. Sidspecifika händelser (mainPage, coachPage, calcPage)
import { setupKeyboardEvents } from './mainPage/events/keyboardEvents.js';
import { setupButtonEvents } from './mainPage/events/buttonEvents.js';
import { setupProcessEvents } from './mainPage/events/processEvents.js';
import { setupCoachEvents } from './coachPage/events/coachEvents.js';
import { setupCalcTabEvents } from './calcPage/events/calcTabEvents.js';
import { initCalculator as initChainCalculator } from './calcPage/calculateChains.js';

// Importera din SusRail-initiering:
import { initSusRailCalc } from './calcPage/susRailCalc/index.js'; 

// Initiera alla eventlyssnare
setupThemeEvents();
setupCoachEvents();
setupKeyboardEvents();
setupViewEvents();
setupButtonEvents();
setupProcessEvents();

// Kalkylatorer & Flikar
setupCalcTabEvents();
initChainCalculator();
initSusRailCalc();