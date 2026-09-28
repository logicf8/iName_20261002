// app\pageControl\state\appState.js

export let displayArray = [];
export let currentIndex = 0;
export let currentTheme = 'default';
export let lastBoldIndex = null;
export let currentView = 'main'; // 'main' | 'coach' | 'calc'

export function setDisplayArray(value) {
  displayArray = value;
}

export function setCurrentIndex(value) {
  currentIndex = value;
}

export function setCurrentTheme(value) {
  currentTheme = value;
}

export function setLastBoldIndex(value) {
  lastBoldIndex = value;
}

export function setCurrentView(value) {
  currentView = value;
}

// Getter för nuvarande vy
export function getCurrentView() {
  return currentView;
}