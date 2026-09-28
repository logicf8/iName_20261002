// app\pageControl\events\viewEvents.js

import { viewToggleRadios, mainView, coachView, calcView } from '../config/selectors.js';
import { setCurrentView, currentView } from '../state/appState.js';

// Minne för scrollpositioner per vy
const scrollPositions = {
  main: 0,
  coach: 0,
  calc: 0
};

export function setupViewEvents() {
  viewToggleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedView = e.target.value;
      const previousView = currentView; // Använd den importerade variabeln direkt

      // 1. Spara scrollpositionen för den vy vi lämnar
      if (previousView && scrollPositions.hasOwnProperty(previousView)) {
        scrollPositions[previousView] = window.scrollY;
      }

      // 2. Sätt globalt state
      setCurrentView(selectedView);

      // 3. Dölj alla vyer
      if (mainView) mainView.style.display = 'none';
      if (coachView) coachView.style.display = 'none';
      if (calcView) calcView.style.display = 'none';

      // 4. Visa den valda vyn
      if (selectedView === 'main' && mainView) {
        mainView.style.display = 'block';
      } else if (selectedView === 'coach' && coachView) {
        coachView.style.display = 'flex';
      } else if (selectedView === 'calc' && calcView) {
        calcView.style.display = 'block';
      }

      // 5. Återställ scrollpositionen för den nya vyn
      const targetScroll = scrollPositions[selectedView] || 0;
      requestAnimationFrame(() => {
        window.scrollTo({
          top: targetScroll,
          behavior: 'instant'
        });
      });
    });
  });
}