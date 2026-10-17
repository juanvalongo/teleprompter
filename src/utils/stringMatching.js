/**
 * Calcula a taxa de acerto do que foi falado em relação ao bloco.
 * Ignora o tamanho total do bloco para não penalizar frases curtas.
 */
export const calculateSimilarity = (spokenText, scriptBlock) => {
  if (!spokenText || !scriptBlock) return 0;

  const spokenWords = spokenText.split(" ").filter(Boolean);
  if (spokenWords.length === 0) return 0;

  const scriptWords = new Set(scriptBlock.split(" "));

  // Conta quantas das palavras que você acabou de falar existem no bloco atual
  let hits = 0;
  spokenWords.forEach((word) => {
    if (scriptWords.has(word)) hits++;
  });

  // Se você falou 4 palavras e 3 estão no texto = 75% de acerto (0.75)
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
