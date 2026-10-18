import { useState, useEffect, useRef, useCallback } from "react";
import { compareScriptToTranscript } from "./scriptComparison";
import { stripHtmlToPlainText } from "../services/scriptsApi";
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  Maximize,
  Minimize,
  Type,
  Eye,
  FileText,
  Check,
  ChevronDown,
} from "lucide-react";

const DEFAULT_SCRIPT = `[BOA NOITE]

COMEÇA AGORA A EDIÇÃO ESPECIAL DO TELEJORNAL.

ACOMPANHE AS PRINCIPAIS NOTÍCIAS DE HOJE NO BRASIL E NO MUNDO.`;

export default function PrompterView() {
  const [fontSize, setFontSize] = useState(52);
  const [speed, setSpeed] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contrastTheme, setContrastTheme] = useState("black");
  const [isMirrorX, setIsMirrorX] = useState(false);
  const [isMirrorY, setIsMirrorY] = useState(false);
  const [showGuideLine, setShowGuideLine] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textAlignment, setTextAlignment] = useState("center");
  const [scriptContent, setScriptContent] = useState(() => {
    try {
      const saved = sessionStorage.getItem("orato_active_script");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.plainText || stripHtmlToPlainText(parsed.content) || DEFAULT_SCRIPT;
      }
    } catch {
      return DEFAULT_SCRIPT;
    }
    return DEFAULT_SCRIPT;
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const comparison = compareScriptToTranscript(scriptContent, transcript);
  const [tempScript, setTempScript] = useState(DEFAULT_SCRIPT);
  const [showControls, setShowControls] = useState(true);

  const scrollContainerRef = useRef(null);
  const prompterRootRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  const toggleFullMirror = useCallback(() => {
    const nextState = !(isMirrorX && isMirrorY);
    setIsMirrorX(nextState);
    setIsMirrorY(nextState);
  }, [isMirrorX, isMirrorY]);

  const handleZoomIn = () => setFontSize((prev) => Math.min(prev + 4, 120));
  const handleZoomOut = () => setFontSize((prev) => Math.max(prev - 4, 24));
  const handleResetZoom = () => setFontSize(52);

  const handleResetScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (prompterRootRef.current?.requestFullscreen) {
        prompterRootRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const scrollStep = (currentTime) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (scrollContainerRef.current) {
        const pixelsPerSecond = speed * 30;
        scrollContainerRef.current.scrollTop += pixelsPerSecond * deltaTime;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setIsPlaying(false);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    };

    animationFrameRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isEditModalOpen || isComparisonOpen) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSpeed((prev) => Math.min(prev + 1, 10));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSpeed((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleFullMirror();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleResetScroll();
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowControls((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditModalOpen, isComparisonOpen, toggleFullMirror, handleResetScroll]);

  const getMirrorClasses = () => {
    const classes = [];
    if (isMirrorX && isMirrorY) {
      classes.push("scale-x-[-1] scale-y-[-1] mirror-mode");
    } else if (isMirrorX) {
      classes.push("scale-x-[-1]");
    } else if (isMirrorY) {
      classes.push("scale-y-[-1]");
    }
    return classes.join(" ");
  };

  const bgClass = contrastTheme === "black" ? "bg-black" : "bg-zinc-950";

  return (
    <div
      ref={prompterRootRef}
      className={`relative w-full h-screen overflow-hidden ${bgClass} text-white select-none transition-colors duration-200 font-sans`}
    >
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        } bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/90 px-4 py-2 text-zinc-100 shadow-2xl`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isPlaying ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isPlaying ? "bg-emerald-500" : "bg-zinc-600"
                  }`}
                ></span>
              </span>
              <span className="font-bold tracking-wider text-xs md:text-sm uppercase text-zinc-200">
                PROMPTER REDE GLOBO
              </span>
            </div>

            {(isMirrorX || isMirrorY) && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ESPELHO: {isMirrorX && isMirrorY ? "X & Y" : isMirrorX ? "EIXO X" : "EIXO Y"}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                  isPlaying
                    ? "bg-amber-500 hover:bg-amber-600 text-black font-bold"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
                title="Iniciar/Pausar rolagem (Espaço)"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? "PAUSAR" : "INICIAR"}</span>
              </button>

              <button
                onClick={handleResetScroll}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                title="Voltar ao início do texto (R)"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1">
              <span className="text-zinc-400 text-xs font-medium">Velocidade:</span>
              <button
                onClick={() => setSpeed((prev) => Math.max(prev - 1, 1))}
                className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs"
                title="Diminuir velocidade"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-16 md:w-20 accent-amber-400 cursor-pointer h-1.5 bg-zinc-700 rounded-lg"
                title={`Velocidade ${speed}x`}
              />
              <button
                onClick={() => setSpeed((prev) => Math.min(prev + 1, 10))}
                className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs"
                title="Aumentar velocidade"
              >
                +
              </button>
              <span className="font-mono text-xs text-amber-400 font-bold w-6 text-center">
                {speed}x
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
              <Type size={14} className="text-zinc-400" />
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
                title="Diminuir fonte (-)"
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={handleResetZoom}
                className="font-mono text-xs px-1 text-zinc-300 hover:text-white"
                title="Restaurar tamanho padrão (52px)"
              >
                {fontSize}px
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
                title="Aumentar fonte (+)"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={toggleFullMirror}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isMirrorX && isMirrorY
                    ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`}
                title="Espelhar eixos X e Y (Tecla M)"
              >
                <FlipHorizontal size={15} />
                <span className="hidden sm:inline">Espelho Total (X/Y)</span>
                <span className="sm:hidden">Espelho</span>
              </button>

              <button
                onClick={() => setIsMirrorX((prev) => !prev)}
                className={`p-1.5 rounded text-xs transition-colors ${
                  isMirrorX ? "text-amber-400 bg-zinc-800 font-bold" : "text-zinc-400 hover:text-white"
                }`}
                title="Inverter apenas Eixo X (Horizontal)"
              >
                X
              </button>
              <button
                onClick={() => setIsMirrorY((prev) => !prev)}
                className={`p-1.5 rounded text-xs transition-colors ${
                  isMirrorY ? "text-amber-400 bg-zinc-800 font-bold" : "text-zinc-400 hover:text-white"
                }`}
                title="Inverter apenas Eixo Y (Vertical)"
              >
                Y
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setContrastTheme((prev) => (prev === "black" ? "zinc-950" : "black"))
              }
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                contrastTheme === "black"
                  ? "bg-black text-white border-zinc-700"
                  : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white"
              }`}
              title="Alternar entre Preto Absoluto (#000) e Zinc-950"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border border-zinc-600 ${
                  contrastTheme === "black" ? "bg-black ring-1 ring-white" : "bg-zinc-950"
                }`}
              />
              <span className="hidden lg:inline">
                {contrastTheme === "black" ? "Preto Puro" : "Zinc 950"}
              </span>
            </button>

            <button
              onClick={() => setShowGuideLine((prev) => !prev)}
              className={`p-1.5 rounded-md text-xs border transition-colors ${
                showGuideLine
                  ? "bg-amber-400/10 border-amber-500/40 text-amber-300"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
              title="Exibir/Ocultar Marcador de Leitura Amarelo"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() =>
                setTextAlignment((prev) => (prev === "center" ? "left" : "center"))
              }
              className="p-1.5 rounded-md text-xs border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title={`Alinhamento: ${textAlignment === "center" ? "Centralizado" : "À Esquerda"}`}
            >
              <span className="font-bold text-[11px]">
                {textAlignment === "center" ? "CENTRO" : "ESQ"}
              </span>
            </button>

            <button
              onClick={() => {
                setTempScript(scriptContent);
                setIsEditModalOpen(true);
              }}
              className="p-1.5 rounded-md text-xs border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Editar texto do roteiro"
            >
              <FileText size={16} />
            </button>

            <button
              onClick={() => setIsComparisonOpen(true)}
              className="flex items-center gap-1.5 p-1.5 rounded-md text-xs border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Comparar transcrição com roteiro"
              aria-label="Comparar transcrição com roteiro"
            >
              <FileText size={16} />
              <span>Conferir Roteiro</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md text-xs border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title={isFullscreen ? "Sair da Tela Cheia" : "Modo Tela Cheia"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
      </header>

      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-3 right-4 z-40 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white p-2 rounded-full border border-zinc-700/60 backdrop-blur transition-all shadow-lg"
          title="Exibir barra de controles (H)"
        >
          <ChevronDown size={18} />
        </button>
      )}

      {showGuideLine && (
        <div
          className="fixed top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-between"
          aria-hidden="true"
        >
          <div className="flex items-center pl-2 sm:pl-4">
            <div className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] md:text-xs font-black tracking-wider uppercase shadow-[0_0_12px_rgba(250,204,21,0.6)] flex items-center gap-1">
              <span>▶</span>
              <span className="hidden sm:inline">LEITURA</span>
            </div>
          </div>

          <div className="flex-1 mx-2 sm:mx-4 h-[2px] bg-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.9)] opacity-90" />

          <div className="flex items-center pr-2 sm:pr-4">
            <div className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] md:text-xs font-black tracking-wider uppercase shadow-[0_0_12px_rgba(250,204,21,0.6)] flex items-center gap-1">
              <span className="hidden sm:inline">LEITURA</span>
              <span>◀</span>
            </div>
          </div>
        </div>
      )}

      {showGuideLine && (
        <div
          className="fixed top-1/2 left-0 right-0 -translate-y-1/2 h-16 pointer-events-none z-10 bg-yellow-400/[0.03] border-y border-yellow-400/10"
          aria-hidden="true"
        />
      )}

      <main
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        tabIndex={0}
      >
        <div className="h-[48vh]" aria-hidden="true" />

        <div
          className={`max-w-5xl mx-auto px-6 sm:px-12 md:px-16 transition-transform duration-300 origin-center ${getMirrorClasses()}`}
        >
          <div
            className={`font-semibold tracking-wide leading-relaxed ${
              textAlignment === "center" ? "text-center" : "text-left"
            } text-white selection:bg-yellow-400 selection:text-black`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.45,
            }}
          >
            {scriptContent.split("\n\n").map((paragraph, index) => {
              const isSectionHeader =
                paragraph.startsWith("[") && paragraph.includes("]");
              const isDivider = paragraph.trim() === "---";

              if (isDivider) {
                return (
                  <hr
                    key={index}
                    className="my-12 border-zinc-800 opacity-60 w-3/4 mx-auto"
                  />
                );
              }

              if (isSectionHeader) {
                return (
                  <div
                    key={index}
                    className="text-amber-400 font-extrabold my-8 tracking-widest text-opacity-95 uppercase text-[0.85em]"
                  >
                    {paragraph}
                  </div>
                );
              }

              return (
                <p key={index} className="my-8 font-medium">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        <div className="h-[52vh]" aria-hidden="true" />
      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-amber-400" />
                Editar Roteiro do Teleprompter
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-2">
              Altere ou cole o texto que será exibido no Prompter. Utilize linhas em branco entre os parágrafos.
            </p>

            <textarea
              value={tempScript}
              onChange={(e) => setTempScript(e.target.value)}
              className="w-full flex-1 min-h-[300px] mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 font-mono text-sm focus:outline-none focus:border-amber-400 resize-none"
              placeholder="Digite ou cole seu roteiro aqui..."
            />

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setTempScript(DEFAULT_SCRIPT)}
                className="text-xs text-zinc-400 hover:text-amber-400 transition-colors"
              >
                Restaurar texto padrão da Globo
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setScriptContent(tempScript);
                    setIsEditModalOpen(false);
                    handleResetScroll();
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Check size={16} />
                  Salvar e Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isComparisonOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="comparison-title"
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 id="comparison-title" className="text-lg font-bold text-white">
                Comparar transcrição com roteiro
              </h2>
              <button
                onClick={() => setIsComparisonOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
                aria-label="Fechar comparação"
              >✕</button>
            </div>

            <p className="text-xs text-zinc-400 mt-3">
              Cole ou digite a transcrição para comparar com o roteiro atualmente carregado.
              A análise é feita localmente neste navegador.
            </p>
            <label htmlFor="transcript-input" className="sr-only">Texto transcrito</label>
            <textarea
              id="transcript-input"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              className="w-full flex-1 min-h-[220px] mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 font-mono text-sm focus:outline-none focus:border-amber-400 resize-y"
              placeholder="Cole aqui o texto transcrito..."
            />

            <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4" aria-live="polite">
              {comparison.score === null ? (
                <p className="text-sm text-zinc-400">{comparison.message}</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm text-zinc-300">Similaridade estimada</span>
                    <strong className={`text-2xl ${comparison.status === "aligned" ? "text-emerald-400" : "text-amber-400"}`}>
                      {comparison.score}%
                    </strong>
                  </div>
                  <p className={`mt-1 text-sm ${comparison.status === "aligned" ? "text-emerald-300" : "text-amber-300"}`}>
                    {comparison.message}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Levenshtein (palavras): {comparison.levenshteinSimilarity}% · Jaccard: {comparison.jaccardSimilarity}% · limite provisório: 80%
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setTranscript("")}
                className="text-xs text-zinc-400 hover:text-amber-400"
              >Limpar transcrição</button>
              <button
                onClick={() => setIsComparisonOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >Fechar</button>
            </div>
          </section>
        </div>
      )}

      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <div className="bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-3">
          <span><kbd className="text-zinc-200 font-mono">Espaço</kbd>: Play/Pause</span>
          <span><kbd className="text-zinc-200 font-mono">↑/↓</kbd>: Velocidade</span>
          <span><kbd className="text-zinc-200 font-mono">+/-</kbd>: Zoom</span>
          <span><kbd className="text-zinc-200 font-mono">M</kbd>: Espelho</span>
          <span><kbd className="text-zinc-200 font-mono">R</kbd>: Topo</span>
          <span><kbd className="text-zinc-200 font-mono">H</kbd>: Ocultar Barra</span>
        </div>
      </footer>
    </div>
  );
}
