/**
 * Equivalente próprio ao SplitText: quebra o texto em <span> por letra
 * (no render, sem tocar no DOM depois), mantendo a frase inteira para leitores de tela.
 */
export function splitChars(text: string): { char: string; key: string; space: boolean }[] {
  return Array.from(text).map((char, i) => ({ char, key: `${i}-${char}`, space: char === " " }));
}
