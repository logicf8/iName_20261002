// app\mainPage\ui\renderChecks.js

import { currentSectionPortfolio } from '../../../main.js';

import { currentTheme } from '../../pageControl/state/appState.js';

import { createCloseBtn } from '../../mainPage/utils/createCloseBtn.js';

export function renderCheckTxts() {
  const mainContainer = document.querySelector('.checkMainContainer');
  const checkContainer = document.querySelector('.checkTxtContainer');
  const zoomContainer = document.querySelector('.zoomResultContainer');

  if (!mainContainer || !checkContainer || !zoomContainer) return;

  const checkTxts = currentSectionPortfolio.returncheckTxts
    ? currentSectionPortfolio.returncheckTxts()
    : currentSectionPortfolio.checkTxts;

  if (!checkTxts || checkTxts.length === 0) {
    mainContainer.style.display = 'none';
    return;
  }

  mainContainer.style.display = 'flex';
  checkContainer.style.display = 'flex';

  checkContainer.innerHTML = '';

  zoomContainer.style.display = 'none';
  zoomContainer.innerHTML = '';

  const header = document.createElement('div');

  header.classList.add('checkTxtHeader');

header.textContent =
  currentTheme === 'pink'
    ? '🦋 Kontroll av artikellista 🦋'
    : currentTheme === 'black'
    ? '🕊️ Kontroll av artikellista 🕊️'
    : '🔍 Kontroll av artikellista 🔎';

  checkContainer.appendChild(header);

  checkTxts.forEach(item => {
    const wrapper = document.createElement('div');

    wrapper.classList.add('checkItem');

    const img = document.createElement('img');

    img.src = `./app/mainPage/pics/testPics/${item.pic}`;
    img.alt = item.title;
    img.width = 50;
    img.height = 50;

    wrapper.appendChild(img);

    const zoom = document.createElement('span');

    zoom.classList.add('checkZoom');
    zoom.textContent = '🔍';

    wrapper.appendChild(zoom);

    const textWrap = document.createElement('div');

    textWrap.classList.add('checkTextWrap');

    const row1 = document.createElement('div');

    row1.classList.add('checkRow1');

    row1.innerHTML = `
      <strong>${item.title}</strong>
      <span class="infoEmoji" title="${item.message || ''}">🛈</span>
      <span class="checkEmoji">${item.emoji || ''}</span>
    `;

    const row2 = document.createElement('div');

    row2.classList.add('checkRow2');
    row2.textContent = item.text;

    textWrap.appendChild(row1);
    textWrap.appendChild(row2);

    wrapper.appendChild(textWrap);

    checkContainer.appendChild(wrapper);

    zoom.addEventListener('click', () => {
      if (!item.rows || item.rows.length === 0) return;

      zoomContainer.innerHTML = '';

      const zoomWrapper = document.createElement('div');

      zoomWrapper.classList.add('zoomContent');

      const zoomTitle = document.createElement('div');

      zoomTitle.classList.add('checkTxtHeader');
      zoomTitle.textContent = item.title;

      zoomWrapper.appendChild(zoomTitle);

      if (item.simpleTable) {
        const table = document.createElement('table');

        table.classList.add('zoomTable');

        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');

        [
          'Test- beskrivning',
          'Resultat',
          'Hittad artikel',
          'Tillgodoser artikel'
        ].forEach(text => {
          const th = document.createElement('th');

          th.textContent = text;

          trHead.appendChild(th);
        });

        thead.appendChild(trHead);

        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        item.rows.forEach(row => {
          const tr = document.createElement('tr');

          const td1 = document.createElement('td');

          td1.textContent = row.label;

          tr.appendChild(td1);

          const td2 = document.createElement('td');

          td2.textContent = row.status;

          tr.appendChild(td2);

          const td3 = document.createElement('td');

          td3.innerHTML = (row.col1 || '-').replace(/\n/g, '<br>');

          tr.appendChild(td3);

          const td4 = document.createElement('td');

          td4.innerHTML = (row.col2 || '-').replace(/\n/g, '<br>');

          tr.appendChild(td4);

          tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        zoomWrapper.appendChild(table);

        zoomWrapper.appendChild(createCloseBtn(zoomContainer));

        zoomContainer.appendChild(zoomWrapper);

        zoomContainer.style.display = 'block';

        return;
      }

      let firstColName = 'Färg';

      if (item.title === 'Frontfamilj') {
        firstColName = 'Artiklar från';
      } else if (
        item.title === 'Glassidor' ||
        item.title === 'Tryck & öppna' ||
        item.title === 'Yttre mått' ||
        item.title === 'Bänkbelysning' ||
        item.title === 'Lådbelysning' ||
        item.title === 'Gångjärn' ||
        item.title === 'Ovanliga lådkombinationer' ||
        item.title === 'Lådfronter & lådor' ||
        item.title === 'Hyllplan' ||
        item.title === 'Spot' ||
        item.title === 'Inre mått'
      ) {
        firstColName = 'Stomme nr ➡️\nInfo ⬇️';
      }

      if (item.headers && item.headers.length > 0) {
        const maxCols = 5;

        for (let i = 0; i < item.headers.length; i += maxCols) {
          const headerSlice = item.headers.slice(i, i + maxCols);

          const table = document.createElement('table');

          table.classList.add('zoomTable', 'zoomTable--grid');

          const thead = document.createElement('thead');
          const trHead = document.createElement('tr');

          const thFirst = document.createElement('th');

          thFirst.textContent = firstColName;

          trHead.appendChild(thFirst);

          headerSlice.forEach(header => {
            const th = document.createElement('th');

            th.textContent = header;

            trHead.appendChild(th);
          });

          thead.appendChild(trHead);

          table.appendChild(thead);

          const tbody = document.createElement('tbody');

          item.rows.forEach(row => {
            const tr = document.createElement('tr');

            const tdFirst = document.createElement('td');

            tdFirst.textContent = row.color || '\u00A0';

            tr.appendChild(tdFirst);

            headerSlice.forEach((_, idx) => {
              const td = document.createElement('td');

              const value = row.numbers[i + idx] || '';

              if (value.includes('\n')) {
                value.split('\n').forEach((line, lineIdx) => {
                  if (lineIdx > 0) {
                    td.appendChild(document.createElement('br'));
                  }

                  td.appendChild(document.createTextNode(line));
                });
              } else {
                td.textContent = value || '\u00A0';
              }

              tr.appendChild(td);
            });

            tbody.appendChild(tr);
          });

          table.appendChild(tbody);

          zoomWrapper.appendChild(table);
        }
      } else {
        const table = document.createElement('table');

        table.classList.add('zoomTable');

        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');

        const thFirst = document.createElement('th');

        thFirst.textContent = firstColName;

        trHead.appendChild(thFirst);

        const th2 = document.createElement('th');

        th2.textContent =
          'Nummer på stomme (samma som i SäljaPro och nKP)';

        trHead.appendChild(th2);

        thead.appendChild(trHead);

        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        item.rows.forEach(row => {
          const tr = document.createElement('tr');

          const tdFirst = document.createElement('td');

          tdFirst.textContent = row.color || '\u00A0';

          tr.appendChild(tdFirst);

          const tdNumbers = document.createElement('td');

          if (row.numbers && row.numbers.length > 0) {
            row.numbers.forEach(num => {
              const span = document.createElement('span');

              span.textContent = num;

              span.classList.add('zoomNumber');

              tdNumbers.appendChild(span);
            });
          } else {
            tdNumbers.textContent = '\u00A0';
            tdNumbers.classList.add('emptyCell');
          }

          tr.appendChild(tdNumbers);

          tbody.appendChild(tr);
        });

        table.appendChild(tbody);

        zoomWrapper.appendChild(table);
      }

      zoomWrapper.appendChild(createCloseBtn(zoomContainer));

      zoomContainer.appendChild(zoomWrapper);

      zoomContainer.style.display = 'block';
    });
  });
}