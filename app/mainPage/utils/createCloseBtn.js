// app\mainPage\utils\createCloseBtn.js

export function createCloseBtn(container) {
  const closeBtn = document.createElement('button');

  closeBtn.textContent = 'Stäng';

  closeBtn.classList.add('closeZoom');

  closeBtn.addEventListener('click', () => {
    container.style.display = 'none';
    container.innerHTML = '';
  });

  return closeBtn;
}