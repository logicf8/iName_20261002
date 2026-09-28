// app\mainPage\ui\renderList.js

import {
  displayList,
  editText
} from '../../mainPage/config/selectors.js';

import {
  displayArray,
  currentIndex,
  setCurrentIndex,
  lastBoldIndex
} from '../../pageControl/state/appState.js';

export function renderList() {
  displayList.innerHTML = '';

  displayArray.forEach((line, index) => {
    const li = document.createElement('li');

    li.classList.add('line');

    if (index === currentIndex) {
      li.classList.add('selected');
    }

    if (index === lastBoldIndex) {
      li.style.fontWeight = 'bold';
    }

    const emojiSpan = document.createElement('span');

    emojiSpan.classList.add('emoji');
    emojiSpan.textContent = line.emoji || '';

    const textSpan = document.createElement('span');

    textSpan.classList.add('text');
    textSpan.textContent = line.text;

    li.appendChild(emojiSpan);
    li.appendChild(textSpan);

    li.addEventListener('click', () => {
      setCurrentIndex(index);
      renderList();
    });

    displayList.appendChild(li);
  });

  const selectedLi = displayList.querySelector('.selected');

  if (selectedLi) {
    selectedLi.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    });
  }

  if (displayArray[currentIndex]) {
    editText.value = displayArray[currentIndex]?.text || '';
  }
}