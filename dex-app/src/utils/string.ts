export const stringEqual = (a: string | number, b: string | number) => {
  a = typeof a === 'number' ? a.toString() : a;
  b = typeof b === 'number' ? b.toString() : b;
  return a.toLowerCase() === b.toLowerCase();
};
