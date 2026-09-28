// app\mainPage\state\cPinState.js

export const cPinAmounts = {};

export function updatePinAmount(artNr, amount) {
  cPinAmounts[artNr] = Number(amount);
}