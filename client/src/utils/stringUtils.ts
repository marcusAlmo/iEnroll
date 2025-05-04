export function capitalizeFirstCharacter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function sanitizeName(name: string) {
  return name.replace(/\s+/g, "_").replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
    index === 0 ? word.toLowerCase() : word.toUpperCase()
  ).replace(/_/g, "");
}
