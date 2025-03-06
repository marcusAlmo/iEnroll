/**
 * Formats a given date into a human-readable string with the format "Month Day, Year".
 *
 * @param date - The date object to format.
 * @returns A string representing the formatted date.
 */

export function formatDateToWords(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};