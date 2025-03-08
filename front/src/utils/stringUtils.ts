export function toTitleCase(str: string): string {
  /**
   * Converts a given string to title case.
   * Title case means the first letter of each word is capitalized.
   * 
   * @param str - The string to be converted to title case.
   * @returns The title-cased string.
   */
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}