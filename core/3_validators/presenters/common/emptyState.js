//C:\PRIVAT\MinaProgram\iName reStructured\core\3_validators\presenters\common\emptyState.js
import {createTxtEntry} from "./createTxtEntry.js"
export function createEmptyState({
  sP,
  title,
  pic,
  message,
  text = "⬛ Nej",
  rows = [],
  headers = []
}) {
  createTxtEntry(sP, {
    title,
    text,
    pic,
    rows,
    headers,
    message
  });
}