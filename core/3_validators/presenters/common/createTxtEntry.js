//C:\PRIVAT\MinaProgram\iName reStructured\core\3_validators\presenters\common\createTxtEntry.js
import { createValidationEntry } from '../../helper/validationResultFactory.js';

export function createTxtEntry(sP, config) {
  createValidationEntry(sP.checkTxts, {
    level: "info",
    rows: [],
    headers: [],
    ...config
  });
}