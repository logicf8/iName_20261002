/**
 * Generell optimeringsalgoritm (Backtracking) för kapning av alla typer av profiler/skenor/lister.
 */
export function calculateProfileCuts(inputMeasurements, profileLength) {
  if (!Array.isArray(inputMeasurements) || profileLength <= 0) {
    return { rails: [], rawList: [] };
  }

  // Ge varje inmatat mått ett unikt measureId för färgkoppling
  let rawItems = inputMeasurements
    .filter(m => typeof m === 'number' && m > 0)
    .map((val, index) => ({ measureId: index, value: val }));

  const processedItems = [];

  // Steg 1: Hantera mått som är större än tillgänglig profillängd säkert
  while (rawItems.length > 0) {
    const item = rawItems.shift();
    if (item.value > profileLength) {
      processedItems.push({ measureId: item.measureId, value: profileLength });
      const remainingVal = item.value - profileLength;
      if (remainingVal > 0) {
        rawItems.push({ measureId: item.measureId, value: remainingVal });
      }
    } else {
      processedItems.push({ measureId: item.measureId, value: item.value });
    }
  }

  // Steg 2: Sortera i fallande ordning för First Fit Decreasing efficiency
  processedItems.sort((a, b) => b.value - a.value);

  // Steg 3: Beräkna teoretiskt lägsta antal profiler
  const totalLength = processedItems.reduce((sum, item) => sum + item.value, 0);
  const minRailsPossible = Math.ceil(totalLength / profileLength);

  let bestSolution = null;

  // Deep clone-hjälpare som är snabbare än JSON.parse/stringify
  function cloneRails(rails) {
    return rails.map(r => ({
      used: r.used,
      remaining: r.remaining,
      items: [...r.items]
    }));
  }

  // Steg 4: Optimized Backtracking
  function backtrack(itemIndex, currentRails) {
    if (bestSolution && bestSolution.length === minRailsPossible) return;
    if (bestSolution && currentRails.length >= bestSolution.length) return;

    if (itemIndex === processedItems.length) {
      if (!bestSolution || currentRails.length < bestSolution.length) {
        bestSolution = cloneRails(currentRails);
      }
      return;
    }

    const item = processedItems[itemIndex];
    let prevRemaining = -1; // För att undvika att prova identiska tomma/likadana skenor

    for (let r = 0; r < currentRails.length; r++) {
      // Skär bort onödiga grepp om flera profiler har exakt samma kvarvarande utrymme
      if (currentRails[r].remaining === prevRemaining) continue;

      if (currentRails[r].remaining >= item.value) {
        prevRemaining = currentRails[r].remaining;
        
        currentRails[r].items.push(item);
        currentRails[r].used += item.value;
        currentRails[r].remaining -= item.value;

        backtrack(itemIndex + 1, currentRails);

        currentRails[r].items.pop();
        currentRails[r].used -= item.value;
        currentRails[r].remaining += item.value;
      }
    }

    if (!bestSolution || currentRails.length + 1 < bestSolution.length) {
      currentRails.push({
        items: [item],
        used: item.value,
        remaining: profileLength - item.value
      });

      backtrack(itemIndex + 1, currentRails);

      currentRails.pop();
    }
  }

  backtrack(0, []);

  return { rails: bestSolution || [], rawList: processedItems };
}