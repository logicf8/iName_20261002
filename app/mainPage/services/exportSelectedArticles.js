// app\mainPage\services\exportSelectedArticles.js

export function exportSelectedArticles() {
  const rows = document.querySelectorAll(
    '.pin-row, .pin-image-item'
  );

  const lines = [];

  rows.forEach(row => {
    const input = row.querySelector(
      'input[type="number"]'
    );

    const artNr = row.dataset.artNr;

    if (!input || !artNr) return;

    const count = Number(input.value);

    if (count > 0) {
      lines.push(`${artNr},${count}`);
    }
  });

  if (!lines.length) {
    alert('Inga artiklar valda!');
    return;
  }

  const blob = new Blob(
    [lines.join('\n')],
    { type: 'text/plain;charset=utf-8;' }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = 'ImportFil.csv';

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}