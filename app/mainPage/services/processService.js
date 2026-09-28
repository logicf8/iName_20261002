// app\mainPage\services\processService.js

import { main, makeTestArray, makeReport } from '../../main.js';

export function processLines(lines) {
  makeTestArray(lines);

  const result = main(lines);

  makeReport();

  return result;
}