export const leftEscape = (str: string): string => {
  return str.replace(/</g, '&lt;');
};
