export function isNrHeader(line) { return /^\d{1,2}\. [A-Z]/.test(line); }
export function isArticleName(line) { return /^[A-ZÅÄÖ]{3,}$/.test(line); }
export function isArticleNumber(line) { return /^\d{3}\.\d{3}\.\d{2}/.test(line); }
export function isQuantity(line) { return /^\d+([.,]\d+)?x$/.test(line); }

