// app\pageControl\config\selectors.js

export const themeToggleRadios = document.querySelectorAll('input[name="themeToggleRadio"]');
export const stylesheet = document.getElementById('themeStylesheet');
export const heading = document.querySelector('h1');

// Vy-kontroller & Vyer
export const viewToggleRadios = document.querySelectorAll('input[name="viewToggleRadio"]');
export const mainView = document.getElementById('mainView');
export const coachView = document.getElementById('coachView');
export const calcView = document.getElementById('calcView');

// Bakåtkompatibilitet ifall andra moduler importerar pageToggle
export const pageToggle = document.getElementById('viewToggle');