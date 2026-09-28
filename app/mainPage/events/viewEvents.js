// app/pageControl/events/viewEvents.js

import { viewToggleRadios, mainView, coachView, calcView } from '../config/selectors.js';
import { setCurrentView } from '../state/appState.js';
import { focusLastCoachElement } from '../../coachPage/events/coachEvents.js';

/**
 * Växlar aktiv vy i DOM och uppdaterar tillstånd.
 * @param {'main' | 'coach' | 'calc'} viewName 
 */
export function setActiveView(viewName) {
  setCurrentView(viewName);

  if (mainView) mainView.style.display = 'none';
  if (coachView) coachView.style.display = 'none';
  if (calcView) calcView.style.display = 'none';

  switch (viewName) {
    case 'coach':
      if (coachView) coachView.style.display = 'flex';
      focusLastCoachElement();
      break;

    case 'calc':
      if (calcView) calcView.style.display = 'block';
      break;

    case 'main':
    default:
      if (mainView) mainView.style.display = 'block';
      break;
  }
}

export function setupViewEvents() {
  if (!viewToggleRadios || viewToggleRadios.length === 0) return;

  viewToggleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        setActiveView(e.target.value);
      }
    });
  });
}