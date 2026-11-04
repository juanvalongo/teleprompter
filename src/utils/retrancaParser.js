/**
 * Utilitário de detecção, parsing e tratamento de Retrancas (slugs jornalísticos).
 *
 * DEFINIÇÃO DE RETRANCA:
 * Cabeçalho de matéria (geralmente primeira linha ou bloco em caixa alta) contendo
 * metadados de estúdio (ex.: "[45]CHAMADA-2 (manhã)" ou "ENTREVISTA - MINISTRO DA SAÚDE").
 * Regra: NUNCA deve ser lida pelo apresentador e NUNCA deve ser considerada
 * pelo algoritmo de STT/Jaccard para sincronização da fala.
 */

const DEFAULT_FALLBACK_LINES = [
  "Senhoras e senhores, sejam bem-vindos à transmissão de lançamento da plataforma ORATO.",
  "Neste momento demonstramos a tecnologia de teleprompter inteligente de última geração.",
  "À medida que você fala, o sistema identifica cada palavra em tempo real e rola o texto automaticamente sem precisar de pedal ou operador manual.",
  "Se você fizer uma pausa ou improvisar, o algoritmo aguarda pacientemente a sua retomada natural.",
];

/**
 * Avalia se uma linha de texto segue o padrão de uma Retranca jornalística.
 * @param {string} text
 * @returns {boolean}
 */
export function isRetrancaText(text) {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (trimmed.length < 3 || trimmed.length > 120) return false;

  // Padrão 1: Código numérico/bloco entre colchetes no início (ex.: "[45]CHAMADA-2 (manhã)", "[VT]", "[BOA NOITE]")
  if (/^\[[\w\d\s\-_./]+\]/i.test(trimmed)) {
    return true;
  }

  // Padrão 2: Prefixo explícito "RETRANCA:" ou "SLUG:"
  if (/^(retranca|slug)\s*:/i.test(trimmed)) {
    return true;
  }

  // Padrão 3: Linha de slug em caixa alta jornalística com letras, hífen, barras (ex.: "ENTREVISTA - MINISTRO DA SAÚDE")
  const withoutParens = trimmed.replace(/\([^)]*\)/g, "").trim();
  const letters = withoutParens.match(/[a-zA-ZÀ-ÿ]/g);

  if (letters && letters.length >= 3) {
    const hasLowercase = /[a-zà-ÿ]/.test(withoutParens);
    if (!hasLowercase && withoutParens.length <= 100) {
      // Não deve ser uma oração completa terminando em pontuação narrativa
      const endsWithSentencePunctuation = /[.!?]$/.test(trimmed);
      if (!endsWithSentencePunctuation) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Transforma texto cru ou HTML identificando e marcando automaticamente
 * a primeira linha como retranca caso siga o padrão jornalístico.
 * @param {string} textOrHtml
 * @returns {string} HTML com data-type="retranca" aplicado
 */
export function parseRetranca(textOrHtml = "") {
  if (!textOrHtml || typeof textOrHtml !== "string") return "";

  const trimmed = textOrHtml.trim();

  // Se já tem marcação de retranca explícita, retorna sem alterações
  if (trimmed.includes('data-type="retranca"') || trimmed.includes("tiptap-retranca-block")) {
    return trimmed;
  }

  // Se é conteúdo HTML com parágrafos
  if (trimmed.includes("<p") || trimmed.includes("<h")) {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(trimmed, "text/html");
        const firstBlock = doc.body.firstElementChild;
        if (firstBlock) {
          const text = firstBlock.textContent?.trim() || "";
          if (isRetrancaText(text)) {
            firstBlock.setAttribute("data-type", "retranca");
            firstBlock.classList.add("tiptap-retranca-block");
            return doc.body.innerHTML;
          }
        }
      } catch {
        // Fallback para regex caso DOMParser falhe
      }
    }

    // Fallback regex para o primeiro <p> ou <h*>
    return trimmed.replace(
      /^(\s*<p)([^>]*>)(.*?)(<\/p>)/is,
      (match, openTag, attrs, content, closeTag) => {
        const plain = content.replace(/<[^>]*>/g, "").trim();
        if (isRetrancaText(plain)) {
          return `${openTag} data-type="retranca" class="tiptap-paragraph tiptap-retranca-block"${attrs}${content}${closeTag}`;
        }
        return match;
      }
    );
  }

  // Se é texto simples:
  const lines = trimmed.split(/\r?\n+/).filter(Boolean);
  if (lines.length > 0 && isRetrancaText(lines[0])) {
    const retrancaLine = `<p data-type="retranca" class="tiptap-paragraph tiptap-retranca-block">${lines[0].trim()}</p>`;
    const bodyLines = lines.slice(1).map((l) => `<p>${l.trim()}</p>`).join("");
    return `${retrancaLine}${bodyLines}`;
  }

  return lines.map((l) => `<p>${l.trim()}</p>`).join("");
}

/**
 * Converte o roteiro (com content HTML ou plainText) em blocos estruturados
 * identificando os blocos marcados ou detectados como Retranca.
 * @param {object} script
 * @returns {Array<{ id: number, text: string, words: string[], isRetranca: boolean }>}
 */
export function parseScriptToBlocks(script = {}) {
  // 1. Tenta extrair blocos a partir do HTML enriquecido do TipTap
  if (script.content && typeof script.content === "string" && script.content.includes("<")) {
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(script.content, "text/html");
        const elements = Array.from(doc.body.children);

        if (elements.length > 0) {
          const parsed = [];
          let blockIndex = 0;

          for (const el of elements) {
            const text = el.textContent?.trim() || "";
            if (!text) continue;

            const isExplicit =
              el.getAttribute("data-type") === "retranca" ||
              el.classList.contains("tiptap-retranca-block") ||
              el.classList.contains("retranca-block");

            // Auto-detecta no primeiro bloco caso não tenha sido explicitado
            const isRetranca = isExplicit || (blockIndex === 0 && isRetrancaText(text));

            parsed.push({
              id: blockIndex,
              text,
              words: text.split(/\s+/).filter(Boolean),
              isRetranca,
            });
            blockIndex++;
          }

          if (parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Erro ao fazer parse dos blocos HTML:", err);
      }
    }
  }

  // 2. Fallback para plainText ou DEFAULT_FALLBACK_LINES
  const rawLines = script.plainText
    ? script.plainText.split(/\n+/).filter((line) => line.trim().length > 0)
    : [];

  const lines = rawLines.length > 0
    ? rawLines.map((line) => line.trim())
    : DEFAULT_FALLBACK_LINES;

  return lines.map((text, index) => {
    const isRetranca = index === 0 && isRetrancaText(text);
    return {
      id: index,
      text,
      words: text.split(/\s+/).filter(Boolean),
      isRetranca,
    };
  });
}

/**
 * Retorna o índice do primeiro bloco legível (não retranca) para iniciar o teleprompter.
 * @param {Array} blocks
 * @returns {number}
 */
export function getFirstReadableBlockIndex(blocks = []) {
  const index = blocks.findIndex((b) => !b.isRetranca);
  return index >= 0 ? index : 0;
}
