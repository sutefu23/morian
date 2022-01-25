export const toNarrowCase = (str: string) => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s:string) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}