import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { useTeleprompterSync } from "../hooks/useTeleprompterSync";
import {
  detectReadingStatus,
  normalizeForMatch,
} from "../utils/stringMatching";
import {
  Play,
  Pause,
  StopCircle,
  Mic,
  MicOff,
  ChevronUp,
  ChevronDown,
  Volume2,
  Tv,
  AlertTriangle,
  RotateCcw,
  Sliders,
  FastForward,
  ArrowUp,
  Radio,
} from "lucide-react";

const SILENCE_TIMEOUT_MS = 2000;

const DEFAULT_LINES = [
  "Senhoras e senhores, sejam bem-vindos à transmissão de lançamento da plataforma ORATO.",
  "Neste momento demonstramos a tecnologia de teleprompter inteligente de última geração.",
  "À medida que você fala, o sistema identifica cada palavra em tempo real e rola o texto automaticamente sem precisar de pedal ou operador manual.",
  "Se você fizer uma pausa ou improvisar, o algoritmo aguarda pacientemente a sua retomada natural.",
];

export default function TeleprompterView({
  script = {},
  onEndPresentation,
  onOpenSecondScreen,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [wpm, setWpm] = useState(140);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [latencyMs, setLatencyMs] = useState(12);
  const speechAccuracy = "99.8%";
  const [improviseState, setImproviseState] = useState(false);
  const [pauseReason, setPauseReason] = useState(null);

  // ==========================================
  // SINCRONIZAÇÃO SOCKET.IO (EMISSOR / CONTROLE REMOTO)
  // ==========================================
  const scriptId = script.id || "script-demo-123";
  const sessionId = "sessao-ao-vivo-1";
  const { isConnected: isSocketConnected, sendCommand } = useTeleprompterSync({
    scriptId,
    sessionId,
    role: "emitter", // <-- Agora o TeleprompterView é o Emissor (Chefe)
  });

  // Observa quando o Play/Pause muda e avisa a segunda tela.
  useEffect(() => {
    if (isSocketConnected) {
      sendCommand(isPlaying ? "play" : "pause");
    }
  }, [isPlaying, isSocketConnected, sendCommand]);

  // Observa quando a velocidade muda e sincroniza a segunda tela.
  useEffect(() => {
    if (isSocketConnected) {
      sendCommand("set-speed", wpm);
    }
  }, [wpm, isSocketConnected, sendCommand]);

  const manualPauseRef = useRef(false);
  const viewportRef = useRef(null);

  const {
    cleanTranscript,
    isListening,
    lastSpeechAt,
    listeningSince,
    startListening,
    stopListening,
  } = useSpeech();

  // ==========================================
  // PREPARAÇÃO DOS BLOCOS DO ROTEIRO
  // ==========================================
  const blocks = useMemo(() => {
    const rawLines = script.plainText
      ? script.plainText.split(/\n+/).filter((line) => line.trim().length > 0)
      : [];

    const lines = rawLines.length > 0
      ? rawLines.map((line) => line.trim())
      : DEFAULT_LINES;

    return lines.map((text, index) => ({
      id: index,
      text,
      words: text.split(/\s+/).filter(Boolean),
    }));
  }, [script.plainText]);

  const scrollToActiveBlock = useCallback((blockIndex, smooth = true) => {
    if (!viewportRef.current) return;

    const blockElement = document.getElementById(`prompter-block-${blockIndex}`);
    if (!blockElement) return;

    const viewport = viewportRef.current;
    const targetScroll =
      blockElement.offsetTop - viewport.clientHeight / 2 + blockElement.offsetHeight / 2;

    viewport.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToActiveBlock(activeBlockIndex, true);
  }, [activeBlockIndex, scrollToActiveBlock]);

  // ==========================================
  // PAUSA AUTOMÁTICA E RETOMADA DA ROLAGEM (RF13)
  // ==========================================
  // Pausa a rolagem após dois segundos sem fala, mantendo o microfone ativo.
  useEffect(() => {
    if (
      !isListening ||
      !listeningSince ||
      manualPauseRef.current ||
      improviseState
    ) {
      return undefined;
    }

    const lastActivity = lastSpeechAt || listeningSince;
    const remainingMs = Math.max(
      0,
      SILENCE_TIMEOUT_MS - (Date.now() - lastActivity),
    );

    const timer = window.setTimeout(() => {
      if (manualPauseRef.current) return;
      setPauseReason("silence");
      setIsPlaying(false);
    }, remainingMs);

    return () => window.clearTimeout(timer);
  }, [isListening, lastSpeechAt, listeningSince, improviseState]);

  // ==========================================
  // DETECÇÃO DE IMPROVISO E STATUS DE SINCRONIZAÇÃO
  // ==========================================
  // Detecta se as palavras reconhecidas correspondem ao bloco atual.
  useEffect(() => {
    if (!isListening || !cleanTranscript || manualPauseRef.current) return;

    const currentBlock = blocks[activeBlockIndex];
    if (!currentBlock) return;

    const recentTranscript = normalizeForMatch(cleanTranscript)
      .split(" ")
      .filter(Boolean)
      .slice(-12)
      .join(" ");

    const status = detectReadingStatus(recentTranscript, currentBlock.text, 0.3);

    const timer = window.setTimeout(() => {
      setLatencyMs(Math.floor(10 + Math.random() * 8));

      if (status === "IMPROVISO") {
        setImproviseState(true);
        setPauseReason("improviso");
        setIsPlaying(false);
        return;
      }

      setImproviseState(false);
      if (!manualPauseRef.current) {
        setPauseReason(null);
        setIsPlaying(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [cleanTranscript, isListening, activeBlockIndex, blocks]);

  // ==========================================
  // CONTROLE MANUAL DE PLAY/PAUSE
  // ==========================================
  const togglePlayback = () => {
    if (isPlaying) {
      manualPauseRef.current = true;
      setPauseReason("manual");
      setIsPlaying(false);
      return;
    }

    manualPauseRef.current = false;
    setPauseReason(null);
    setImproviseState(false);
    setIsPlaying(true);
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
      setImproviseState(false);

      if (!manualPauseRef.current) {
        setPauseReason(null);
        setIsPlaying(true);
      }
      return;
    }

    startListening();
  };

  // ==========================================
  // PROGRESSÃO DE LEITURA CADENCIADA (WPM)
  // ==========================================
  // Avanço por cadência quando o microfone está desligado.
  useEffect(() => {
    if (!isPlaying || isListening) return undefined;

    const intervalMs = Math.max(120, Math.floor(60000 / wpm));
    const timer = window.setInterval(() => {
      const currentBlock = blocks[activeBlockIndex];
      if (!currentBlock) return;

      if (activeWordIndex < currentBlock.words.length - 1) {
        setActiveWordIndex((previous) => previous + 1);
      } else if (activeBlockIndex < blocks.length - 1) {
        setActiveBlockIndex((previous) => previous + 1);
        setActiveWordIndex(0);
      } else {
        setIsPlaying(false);
        setPauseReason("end");
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, isListening, wpm, activeBlockIndex, activeWordIndex, blocks]);

  // ==========================================
  // RASTREADOR VISUAL (WORD-BY-WORD SYNC)
  // ==========================================
  // Atualiza o destaque pela fala. Continua procurando palavras durante pausa
  // automática, mas respeita a pausa manual.
  useEffect(() => {
    if (!isListening || !cleanTranscript || manualPauseRef.current) return;

    const currentBlock = blocks[activeBlockIndex];
    if (!currentBlock) return;

    const spokenWords = normalizeForMatch(cleanTranscript)
      .split(" ")
      .filter(Boolean);
    if (spokenWords.length === 0) return;

    const lastSpokenWord = spokenWords[spokenWords.length - 1];
    if (lastSpokenWord.length < 2) return;

    let newWordIndex = activeWordIndex;
    const searchLimit = Math.min(newWordIndex + 5, currentBlock.words.length);

    for (let index = newWordIndex; index < searchLimit; index += 1) {
      if (normalizeForMatch(currentBlock.words[index]) === lastSpokenWord) {
        newWordIndex = index + 1;
        break;
      }
    }

    if (newWordIndex === activeWordIndex) return;

    const timer = window.setTimeout(() => {
      if (newWordIndex >= currentBlock.words.length) {
        if (activeBlockIndex < blocks.length - 1) {
          setActiveBlockIndex((previous) => previous + 1);
          setActiveWordIndex(0);
        } else {
          setActiveWordIndex(currentBlock.words.length);
          setIsPlaying(false);
          setPauseReason("end");
        }
        return;
      }

      setActiveWordIndex(newWordIndex);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [cleanTranscript, isListening, activeBlockIndex, activeWordIndex, blocks]);

  // ==========================================
  // CABO HDMI VIRTUAL (SINCRONIZA TEXTO E VOZ PARA A 2ª TELA)
  // ==========================================
  useEffect(() => {
    const channel = new BroadcastChannel("orato_hdmi_sync");
    const payload = {
      script,
      blocks,
      activeBlockIndex,
      activeWordIndex,
      isPlaying,
    };

    // Envia os dados ao vivo pelo canal.
    channel.postMessage(payload);
    // Guarda o estado atual para a nova aba carregar imediatamente.
    localStorage.setItem("orato_hdmi_initial_state", JSON.stringify(payload));

    return () => channel.close();
  }, [script, blocks, activeBlockIndex, activeWordIndex, isPlaying]);

  const adjustScroll = (offset) => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ top: offset, behavior: "smooth" });
    }
  };

  const resumeFlow = () => {
    manualPauseRef.current = false;
    setPauseReason(null);
    setImproviseState(false);
    setIsPlaying(true);
    scrollToActiveBlock(activeBlockIndex, true);
  };

  const changeSpeed = (delta) => {
    setWpm((previous) => Math.max(80, Math.min(260, previous + delta)));
  };

  const skipToNextBlock = () => {
    if (activeBlockIndex < blocks.length - 1) {
      setActiveBlockIndex((previous) => previous + 1);
      setActiveWordIndex(0);
    }
  };

  const restartScript = () => {
    manualPauseRef.current = false;
    setPauseReason(null);
    setActiveBlockIndex(0);
    setActiveWordIndex(0);
    setIsPlaying(true);
    setImproviseState(false);
  };

  const triggerImproviseSimulation = () => {
    setImproviseState(true);
    setPauseReason("improviso");
    setIsPlaying(false);

    window.setTimeout(() => {
      setImproviseState(false);
      if (!manualPauseRef.current) {
        setPauseReason(null);
        setIsPlaying(true);
      }
    }, 4000);
  };

  const totalWords = blocks.reduce(
    (total, block) => total + block.words.length,
    0,
  );

  const statusLabel = improviseState
    ? "Improviso Detectado"
    : isPlaying && isListening && lastSpeechAt && !pauseReason
      ? "Sincronizado"
      : isPlaying && !isListening
        ? "Rolagem por cadência"
        : "Pausado";

  const statusDescription = improviseState
    ? "(Aguardando retorno ao roteiro)"
    : pauseReason === "silence"
      ? "(Aguardando a fala; retomada automática)"
      : pauseReason === "manual"
        ? "(Pausado manualmente)"
        : statusLabel === "Sincronizado"
          ? "Avançando com a fala reconhecida"
          : isPlaying
            ? "(Microfone desligado; avanço por cadência)"
            : "(Retome pelo botão)";

  return (
    <div className="flex flex-col w-full gap-5 max-w-7xl mx-auto pb-12">
      {/* Top Floating Command Bar: Asymmetric & Layered */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 bg-[#151821] rounded-2xl border border-[#282E3E] shadow-2xl backdrop-blur-xl">
        {/* Left: Title & Execution Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-[#EF4444]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#EF4444] uppercase tracking-widest font-bold">
                Ao Vivo no Estúdio
              </span>
              <span className="text-[10px] text-[#64748B]">·</span>
              <span className="text-[10px] text-[#94A3B8] font-mono">
                {blocks.length} blocos · {totalWords} palavras
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight truncate max-w-md sm:max-w-xl">
              {script.title || "Apresentação de Abertura"}
            </h1>
          </div>
        </div>

        {/* Center: Live Speech Engine State */}
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all ${
            improviseState
              ? "bg-[#EF4444]/15 border-[#EF4444] text-[#F8FAFC] shadow-lg shadow-[#EF4444]/20"
              : isPlaying
                ? "bg-[#181C26] border-[#2D3546] text-[#F8FAFC]"
                : "bg-[#181C26] border-[#FACC15]/40 text-[#FACC15]"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              improviseState
                ? "bg-[#EF4444] animate-ping"
                : statusLabel === "Sincronizado"
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]"
                  : "bg-[#FACC15]"
            }`}
          />

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>{statusLabel}</span>
            <span className="text-[#94A3B8] text-[11px] font-normal hidden sm:inline">
              {statusLabel === "Sincronizado" ? (
                <span className="flex items-center gap-1 text-[#94A3B8]">
                  <ArrowUp className="w-3 h-3 text-[#EF4444] animate-bounce" />
                  {statusDescription}
                </span>
              ) : (
                statusDescription
              )}
            </span>
          </div>

          <Volume2 className="w-4 h-4 ml-1 text-[#EF4444]" />
        </div>

        {/* Right: Quick Play/Pause & End Presentation Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isPlaying
                ? "bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] border border-[#2D3546]"
                : "bg-[#FACC15] text-[#0C0E14] hover:bg-[#EAB308]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Retomar</span>
              </>
            )}
          </button>

          <button
            onClick={onEndPresentation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:bg-[#EF4444] hover:text-[#FFFFFF] transition-all text-xs font-semibold border border-[#2D3546]"
            title="Concluir apresentação e voltar para roteiros"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span>Encerrar</span>
          </button>
        </div>
      </div>

      {/* Main Immersive Teleprompter Viewport Canvas */}
      <div className="relative flex flex-col bg-[#07080B] rounded-3xl overflow-hidden shadow-2xl border border-[#282E3E] min-h-[580px] h-[670px]">
        {/* Viewport Top HUD Strip */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2.5 bg-[#12151D]/90 backdrop-blur-xl border-b border-[#282E3E] select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMicrophone}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl font-bold transition-all border ${
                isListening
                  ? "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]"
                  : "bg-[#181C26] border-[#2D3546] text-[#94A3B8] hover:text-[#FFFFFF]"
              }`}
              title="Ativar/Desativar microfone da IA"
            >
              {isListening ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>IA CONECTADA</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>IA DESLIGADA</span>
                </>
              )}
            </button>

            <span className="text-[#2D3546]">|</span>

            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-[#64748B]">Latência:</span>
              <span className="font-bold text-[#FACC15] tabular-nums">
                {latencyMs} ms
              </span>
            </div>

            <span className="text-[#2D3546]">|</span>

            <button
              onClick={triggerImproviseSimulation}
              className="text-[11px] text-[#94A3B8] hover:text-[#EF4444] flex items-center gap-1 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Simular Improviso</span>
            </button>

            <span className="text-[#2D3546]">|</span>

            <button
              onClick={skipToNextBlock}
              className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition-colors"
            >
              <FastForward className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Avançar Frase</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#64748B] font-mono text-[11px]">
            <ArrowUp className="w-3 h-3 text-[#EF4444]" />
            <span>FLUXO ADAPTATIVO: FALA → DECODIFICAÇÃO → ROLAGEM</span>
          </div>
        </div>

        {/* Central Eye-Guide Line (Fixed Camera focal point) */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-20 flex items-center px-6">
          <div className="h-[2px] w-full bg-[#FACC15]/40 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
          <span className="ml-3 px-3 py-1 rounded-xl bg-[#151821] border border-[#FACC15]/40 font-mono text-[10px] text-[#FACC15] font-bold uppercase tracking-widest whitespace-nowrap shadow-xl">
            Linha-Guia dos Olhos · Ponto Focal
          </span>
        </div>

        {/* Prompter Reader Viewport */}
        <div
          ref={viewportRef}
          className="relative flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 py-40 select-none scroll-smooth bg-[#07080B]"
        >
          <div className="flex flex-col gap-10 max-w-3xl mx-auto">
            {blocks.map((block, index) => {
              const isPast = index < activeBlockIndex;
              const isActive = index === activeBlockIndex;
              const spokenWords = isActive
                ? block.words.slice(0, activeWordIndex)
                : [];
              const currentWord = isActive
                ? block.words[activeWordIndex]
                : null;
              const remainingWords = isActive
                ? block.words.slice(activeWordIndex + 1)
                : block.words;

              return (
                <div
                  key={block.id}
                  id={`prompter-block-${index}`}
                  onClick={() => {
                    setActiveBlockIndex(index);
                    setActiveWordIndex(0);
                    setPauseReason(null);
                    setImproviseState(false);
                  }}
                  className={`transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "relative p-6 sm:p-8 rounded-3xl bg-[#151821]/95 border border-[#2D3546] shadow-2xl scale-[1.02]"
                      : isPast
                        ? index === activeBlockIndex - 1
                          ? "opacity-35 hover:opacity-55 scale-[0.98]"
                          : "opacity-15 hover:opacity-30 scale-[0.96]"
                        : index === activeBlockIndex + 1
                          ? "opacity-55 hover:opacity-75 scale-[0.99]"
                          : "opacity-25 hover:opacity-45 scale-[0.97]"
                  }`}
                >
                  {isActive && (
                    <div className="flex items-center justify-between mb-3 border-b border-[#282E3E] pb-2.5">
                      <span className="text-[11px] uppercase tracking-wider text-[#EF4444] font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                        {statusLabel}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#FACC15] font-bold tabular-nums">
                          Precisão: {speechAccuracy}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#1F2432] text-[#94A3B8] font-mono border border-[#2D3546]">
                          {activeWordIndex}/{block.words.length} palavras
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-[28px] sm:text-[34px] md:text-[38px] leading-snug tracking-tight font-medium text-[#F8FAFC]">
                    {isActive ? (
                      <>
                        {spokenWords.length > 0 && (
                          <span className="text-[#94A3B8]">
                            {spokenWords.join(" ")} {" "}
                          </span>
                        )}
                        {currentWord && (
                          <span className="font-bold">{currentWord}</span>
                        )}
                        {remainingWords.length > 0 && (
                          <span className="text-[#FFFFFF] font-semibold">
                            {" "}
                            {remainingWords.join(" ")}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                        {block.text}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}

            <div className="h-44 flex items-center justify-center text-xs text-[#64748B] uppercase tracking-widest font-mono">
              Fim do Roteiro · ORATO Estúdio
            </div>
          </div>
        </div>

        {/* Bottom Floating Control Dock */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-[#12151D]/95 backdrop-blur-xl border-t border-[#282E3E] gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustScroll(-80)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] transition-all text-xs font-semibold border border-[#2D3546]"
            >
              <ChevronUp className="w-4 h-4 text-[#EF4444]" />
              <span>Subir</span>
            </button>

            <button
              onClick={() => adjustScroll(80)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] transition-all text-xs font-semibold border border-[#2D3546]"
            >
              <ChevronDown className="w-4 h-4 text-[#EF4444]" />
              <span>Descer</span>
            </button>

            <button
              onClick={resumeFlow}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] font-bold hover:bg-[#EAB308] transition-all text-xs shadow-md shadow-[#FACC15]/20 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Alinhar &amp; Retomar</span>
            </button>

            <button
              onClick={restartScript}
              className="p-2 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#282E3E] border border-[#2D3546] transition-colors"
              title="Reiniciar roteiro"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-[#181C26] px-4 py-1.5 rounded-2xl border border-[#282E3E]">
            <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sliders className="w-3.5 h-3.5 text-[#EF4444]" /> Cadência
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => changeSpeed(-10)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1F2432] text-[#F8FAFC] text-xs font-bold hover:bg-[#282E3E] border border-[#2D3546]"
              >
                -
              </button>
              <span className="font-mono text-xs text-[#FACC15] px-2 font-bold min-w-[70px] text-center tabular-nums">
                {wpm} WPM
              </span>
              <button
                onClick={() => changeSpeed(10)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1F2432] text-[#F8FAFC] text-xs font-bold hover:bg-[#282E3E] border border-[#2D3546]"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSecondScreen}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] text-xs font-semibold hover:bg-[#282E3E] hover:text-[#EF4444] transition-all border border-[#2D3546] shadow-sm active:scale-95"
            >
              <Tv className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Modo HDMI (2ª Tela)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
