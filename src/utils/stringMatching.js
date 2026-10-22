/** Normaliza palavras para comparar fala e roteiro em português. */
export const normalizeForMatch = (text = "") =>
  String(text)
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Mede a proporção de palavras reconhecidas presentes no bloco atual.
 * Mantém o comportamento simples existente (0 a 1), mas ignora acentos,
 * caixa, pontuação e espaços duplicados nos dois textos.
 */
export const calculateSimilarity = (spokenText, scriptBlock) => {
  const spokenWords = normalizeForMatch(spokenText).split(" ").filter(Boolean);
  const scriptWords = new Set(
    normalizeForMatch(scriptBlock).split(" ").filter(Boolean),
  );

  if (spokenWords.length === 0 || scriptWords.size === 0) return 0;

  const hits = spokenWords.filter((word) => scriptWords.has(word)).length;
  return hits / spokenWords.length;
};

export const detectReadingStatus = (
  spokenText,
  scriptBlock,
  threshold = 0.3,
) => {
  const similarity = calculateSimilarity(spokenText, scriptBlock);
  return similarity >= threshold ? "SINCRONIZADO" : "IMPROVISO";
};
