//C:\PRIVAT\MinaProgram\iName reStructured\core\3_validators\presenters\common\emptyHeaders.js
import { createEmptyState } from './emptyState.js';

export function withEmptyHeaders(result, emptyConfig) {
  if (!result || !Array.isArray(result.headers)) return null;

  if (result.headers.length === 0) {
    createEmptyState(emptyConfig);
    return null;
  }

  return result.headers;
}