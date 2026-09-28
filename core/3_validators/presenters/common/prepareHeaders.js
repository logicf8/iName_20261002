import { withEmptyHeaders } from "./emptyHeaders.js";

export function prepareHeaders(result, emptyConfig) {
  const validHeaders = withEmptyHeaders(result, emptyConfig);

  if (!validHeaders) {
    return null;
  }

  return {
    validHeaders,
    headers: validHeaders.map(h => String(h.header))
  };
}