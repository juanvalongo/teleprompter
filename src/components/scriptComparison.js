export function normalizeForComparison(text = "") {
  return String(text)
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/^\s*---\s*$/gm, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshteinWords(left, right) {
  const a = left ? left.split(" ") : [];
  const b = right ? right.split(" ") : [];
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous = current;
  }
  return previous[b.length];
}

export function compareScriptToTranscript(script, transcript) {
  const normalizedScript = normalizeForComparison(script);
  const normalizedTranscript = normalizeForComparison(transcript);
  const scriptWords = normalizedScript ? normalizedScript.split(" ") : [];
  const transcriptWords = normalizedTranscript ? normalizedTranscript.split(" ") : [];

  if (!scriptWords.length || !transcriptWords.length) {
    return {
      score: null,
      levenshteinSimilarity: null,
      jaccardSimilarity: null,
      status: "incomplete",
      message: !scriptWords.length ? "O roteiro não contém texto comparável." : "Insira a transcrição para comparar.",
    };
  }

  const distance = levenshteinWords(normalizedScript, normalizedTranscript);
  const levenshteinSimilarity = Math.max(
    0,
    1 - distance / Math.max(scriptWords.length, transcriptWords.length),
  );

  const scriptSet = new Set(scriptWords);
  const transcriptSet = new Set(transcriptWords);
  let intersection = 0;
  for (const word of scriptSet) if (transcriptSet.has(word)) intersection += 1;
  const union = new Set([...scriptSet, ...transcriptSet]).size;
  const jaccardSimilarity = union ? intersection / union : 0;

  const score = Math.round(((levenshteinSimilarity + jaccardSimilarity) / 2) * 100);
  const status = score >= 80 ? "aligned" : "improvisation";

  return {
    score,
    levenshteinSimilarity: Math.round(levenshteinSimilarity * 100),
    jaccardSimilarity: Math.round(jaccardSimilarity * 100),
    status,
    message: status === "aligned"
      ? "Boa aderência ao roteiro."
      : "Possíveis improvisos ou divergências em relação ao roteiro.",
  };
}
