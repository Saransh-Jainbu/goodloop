// OWNER: Aditya. CSV helper utilities.

/**
 * Neutralises values that start with '=', '+', '-', '@', tab, or carriage return
 * by prefixing a single quote to protect against spreadsheet formula injection
 * in Excel / Google Sheets.
 */
export const sanitizeForCsv = (v: string): string =>
  /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
