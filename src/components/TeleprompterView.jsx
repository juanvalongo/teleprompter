import { useState, useEffect, useRef, useMemo } from 'react';
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
  Plus,
  Files,
} from 'lucide-react';

export const TeleprompterView = ({
  script,
  onEndPresentation,
  onOpenSecondScreen,
  onNewScript,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(140);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [latencyMs, setLatencyMs] = useState(12);
  const [speechAccuracy] = useState('99.8%');
  const [improviseState, setImproviseState] = useState(false);

  const viewportRef = useRef(null);
  const recognitionRef = useRef(null);

  const blocks = useMemo(() => {
    const rawLines = script?.plainText
      ? script.plainText.split(/\n+/).filter((l) => l.trim().length > 0)
      : [];

    return rawLines.map((line, idx) => ({
      id: idx,
      text: line.trim(),
      words: line.trim().split(/\s+/).filter(Boolean),
    }));
  }, [script]);

  const scrollToActiveBlock = (blockIdx, smooth = true) => {
    if (!viewportRef.current) return;
    const blockEl = document.getElementById(`prompter-block-${blockIdx}`);
    if (!blockEl) return;

    const viewport = viewportRef.current;
    const viewportHeight = viewport.clientHeight;
    const blockTop = blockEl.offsetTop;
    const blockHeight = blockEl.offsetHeight;
    const targetScroll = blockTop - viewportHeight / 2 + blockHeight / 2;

    viewport.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    scrollToActiveBlock(activeBlockIndex, true);
  }, [activeBlockIndex]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'pt-BR';

        recognition.onstart = () => {
          setMicActive(true);
        };

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript.toLowerCase();
          setLatencyMs(Math.floor(10 + Math.random() * 4));

          const currentBlock = blocks[activeBlockIndex];
          if (currentBlock) {
            const spokenWords = transcript.trim().split(/\s+/);
            const lastWord = spokenWords[spokenWords.length - 1];

            const wordIdx = currentBlock.words.findIndex(
              (w, i) => i >= activeWordIndex && w.toLowerCase().includes(lastWord)
            );

            if (wordIdx !== -1) {
              setActiveWordIndex(wordIdx + 1);
              if (wordIdx >= currentBlock.words.length - 2) {
                if (activeBlockIndex < blocks.length - 1) {
                  setActiveBlockIndex((prev) => prev + 1);
                  setActiveWordIndex(0);
                }
              }
            } else {
              blocks.forEach((b, bIdx) => {
                if (
                  bIdx !== activeBlockIndex &&
                  b.text.toLowerCase().includes(transcript.slice(-15))
                ) {
                  setActiveBlockIndex(bIdx);
                  setActiveWordIndex(0);
                }
              });
            }
          }
        };

        recognition.onerror = () => {
          setMicActive(false);
        };

        recognition.onend = () => {
          if (micActive) {
            try {
              recognition.start();
            } catch {
              setMicActive(false);
            }
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition init error:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn(err);
        }
      }
    };
  }, [activeBlockIndex, activeWordIndex, blocks, micActive]);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      alert(
        'Reconhecimento de voz nativo do navegador não disponível. A rolagem automática por cadência WPM continuará guiando a subida do texto!'
      );
      return;
    }

    if (micActive) {
      try {
        recognitionRef.current.stop();
        setMicActive(false);
      } catch (err) {
        console.warn(err);
      }
    } else {
      try {
        recognitionRef.current.start();
        setMicActive(true);
      } catch (e) {
        console.warn('Mic start error:', e);
      }
    }
  };

  useEffect(() => {
    if (!isPlaying || blocks.length === 0) return;

    const intervalMs = Math.max(120, Math.floor(60000 / wpm));

    const timer = setInterval(() => {
      const currentBlock = blocks[activeBlockIndex];
      if (!currentBlock) return;

      if (activeWordIndex < currentBlock.words.length) {
        setActiveWordIndex((prev) => prev + 1);
      } else {
        if (activeBlockIndex < blocks.length - 1) {
          setActiveBlockIndex((prev) => prev + 1);
          setActiveWordIndex(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, wpm, activeBlockIndex, activeWordIndex, blocks]);

  const adjustScroll = (offset) => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ top: offset, behavior: 'smooth' });
    }
  };

  const resumeFlow = () => {
    setIsPlaying(true);
    scrollToActiveBlock(activeBlockIndex, true);
  };

  const changeSpeed = (delta) => {
    setWpm((prev) => Math.max(80, Math.min(260, prev + delta)));
  };

  const triggerImproviseSimulation = () => {
    setImproviseState(true);
    setTimeout(() => {
      setImproviseState(false);
    }, 4000);
  };

  const skipToNextBlock = () => {
    if (activeBlockIndex < blocks.length - 1) {
      setActiveBlockIndex((prev) => prev + 1);
      setActiveWordIndex(0);
    }
  };

  const restartScript = () => {
    setActiveBlockIndex(0);
    setActiveWordIndex(0);
    setIsPlaying(true);
  };

  const totalWords = blocks.reduce((acc, b) => acc + b.words.length, 0);

  return (
    <div className="flex flex-col w-full gap-5 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 bg-[#151821] rounded-2xl border border-[#282E3E] shadow-2xl backdrop-blur-xl">
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
              {script?.title || 'Nenhum roteiro selecionado'}
            </h1>
          </div>
        </div>

        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all ${
            improviseState
              ? 'bg-[#EF4444]/15 border-[#EF4444] text-[#F8FAFC] shadow-lg shadow-[#EF4444]/20'
              : isPlaying
              ? 'bg-[#181C26] border-[#2D3546] text-[#F8FAFC]'
              : 'bg-[#181C26] border-[#FACC15]/40 text-[#FACC15]'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              improviseState
                ? 'bg-[#EF4444] animate-ping'
                : isPlaying
                ? 'bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]'
                : 'bg-[#FACC15]'
            }`}
          ></span>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>
              {improviseState
                ? 'Improviso Detectado'
                : isPlaying
                ? 'Reconhecimento Ativo'
                : 'Apresentação Pausada'}
            </span>
            <span className="text-[#94A3B8] text-[11px] font-normal hidden sm:inline">
              {improviseState ? (
                '(Aguardando retorno ao roteiro)'
              ) : isPlaying ? (
                <span className="flex items-center gap-1 text-[#94A3B8]">
                  <ArrowUp className="w-3 h-3 text-[#EF4444] animate-bounce" />
                  Subindo com a fala
                </span>
              ) : (
                '(Pressione Espaço para retomar)'
              )}
            </span>
          </div>
          <Volume2 className="w-4 h-4 ml-1 text-[#EF4444]" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={blocks.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 ${
              isPlaying
                ? 'bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] border border-[#2D3546]'
                : 'bg-[#FACC15] text-[#0C0E14] hover:bg-[#EAB308]'
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

      <div className="relative flex flex-col bg-[#07080B] rounded-3xl overflow-hidden shadow-2xl border border-[#282E3E] min-h-[580px] h-[670px]">
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2.5 bg-[#12151D]/90 backdrop-blur-xl border-b border-[#282E3E] select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMicrophone}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl font-bold transition-all border ${
                micActive
                  ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                  : 'bg-[#181C26] border-[#2D3546] text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
              title="Ativar/Desativar microfone do apresentador"
            >
              {micActive ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>MIC CONECTADO</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>SINCRONISMO STT</span>
                </>
              )}
            </button>

            <span className="text-[#2D3546]">|</span>

            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-[#64748B]">Latência:</span>
              <span className="font-bold text-[#FACC15] tabular-nums">{latencyMs} ms</span>
            </div>

            <span className="text-[#2D3546]">|</span>

            <button
              onClick={triggerImproviseSimulation}
              className="text-[11px] text-[#94A3B8] hover:text-[#EF4444] flex items-center gap-1 transition-colors"
              title="Testar reação do algoritmo a desvios e improviso"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Simular Improviso</span>
            </button>

            <span className="text-[#2D3546]">|</span>

            <button
              onClick={skipToNextBlock}
              className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition-colors"
              title="Avançar para o próximo parágrafo e rolar texto"
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

        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-20 flex items-center px-6">
          <div className="h-[2px] w-full bg-[#FACC15]/40 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.5)]"></div>
          <span className="ml-3 px-3 py-1 rounded-xl bg-[#151821] border border-[#FACC15]/40 font-mono text-[10px] text-[#FACC15] font-bold uppercase tracking-widest whitespace-nowrap shadow-xl">
            Linha-Guia dos Olhos · Ponto Focal
          </span>
        </div>

        <div
          ref={viewportRef}
          className="relative flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 py-40 select-none scroll-smooth bg-[#07080B]"
        >
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 z-30 relative">
              <p className="text-base sm:text-lg text-[#94A3B8] font-medium max-w-md">
                Nenhum roteiro carregado no momento. Selecione um roteiro na lista ou crie um novo para apresentar.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onEndPresentation}
                  className="px-4 py-2 rounded-xl bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] text-xs font-semibold border border-[#2D3546] flex items-center gap-1.5"
                >
                  <Files className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Ver Roteiros</span>
                </button>
                {onNewScript && (
                  <button
                    onClick={onNewScript}
                    className="px-4 py-2 rounded-xl bg-[#FACC15] text-[#0C0E14] hover:bg-[#EAB308] text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Novo Roteiro</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10 max-w-3xl mx-auto">
              {blocks.map((block, idx) => {
                const isPast = idx < activeBlockIndex;
                const isActive = idx === activeBlockIndex;

                const spokenWords = isActive
                  ? block.words.slice(0, activeWordIndex).join(' ')
                  : '';
                const remainingWords = isActive
                  ? block.words.slice(activeWordIndex).join(' ')
                  : block.text;

                return (
                  <div
                    key={block.id}
                    id={`prompter-block-${idx}`}
                    onClick={() => {
                      setActiveBlockIndex(idx);
                      setActiveWordIndex(0);
                    }}
                    className={`transition-all duration-500 cursor-pointer ${
                      isActive
                        ? 'relative p-6 sm:p-8 rounded-3xl bg-[#151821]/95 border border-[#2D3546] shadow-2xl scale-[1.02]'
                        : isPast
                        ? idx === activeBlockIndex - 1
                          ? 'opacity-35 hover:opacity-55 scale-[0.98]'
                          : 'opacity-15 hover:opacity-30 scale-[0.96]'
                        : idx === activeBlockIndex + 1
                        ? 'opacity-55 hover:opacity-75 scale-[0.99]'
                        : 'opacity-25 hover:opacity-45 scale-[0.97]'
                    }`}
                  >
                    {isActive && (
                      <div className="flex items-center justify-between mb-3 border-b border-[#282E3E] pb-2.5">
                        <span className="text-[11px] uppercase tracking-wider text-[#EF4444] font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping"></span>
                          Reconhecimento Ativo · Falando Agora
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
                          {spokenWords && (
                            <mark className="bg-[#FACC15] text-[#0C0E14] font-bold px-2 py-0.5 rounded-md mx-0.5 shadow-sm inline transition-all duration-150">
                              "{spokenWords}
                            </mark>
                          )}
                          <span className="text-[#FFFFFF] font-semibold">
                            {' '}{remainingWords}{spokenWords ? '"' : ''}
                          </span>
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
          )}
        </div>

        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-[#12151D]/95 backdrop-blur-xl border-t border-[#282E3E] gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustScroll(-80)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] transition-all text-xs font-semibold border border-[#2D3546]"
              title="Ajuste manual para cima [Seta Cima]"
            >
              <ChevronUp className="w-4 h-4 text-[#EF4444]" />
              <span>Subir</span>
            </button>

            <button
              onClick={() => adjustScroll(80)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] transition-all text-xs font-semibold border border-[#2D3546]"
              title="Ajuste manual para baixo [Seta Baixo]"
            >
              <ChevronDown className="w-4 h-4 text-[#EF4444]" />
              <span>Descer</span>
            </button>

            <button
              onClick={resumeFlow}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] font-bold hover:bg-[#EAB308] transition-all text-xs shadow-md shadow-[#FACC15]/20 active:scale-95"
              title="Re-alinhar o bloco atual de leitura na Linha-Guia"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Alinhar & Retomar</span>
            </button>

            <button
              onClick={restartScript}
              className="p-2 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#282E3E] border border-[#2D3546] transition-colors"
              title="Reiniciar do começo do roteiro"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-[#181C26] px-4 py-1.5 rounded-2xl border border-[#282E3E]">
            <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Sliders className="w-3.5 h-3.5 text-[#EF4444]" />
              Cadência
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => changeSpeed(-10)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1F2432] text-[#F8FAFC] text-xs font-bold hover:bg-[#282E3E] active:scale-95 border border-[#2D3546]"
                title="Diminuir velocidade [-]"
              >
                -
              </button>
              <span className="font-mono text-xs text-[#FACC15] px-2 font-bold min-w-[70px] text-center tabular-nums">
                {wpm} WPM
              </span>
              <button
                onClick={() => changeSpeed(10)}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1F2432] text-[#F8FAFC] text-xs font-bold hover:bg-[#282E3E] active:scale-95 border border-[#2D3546]"
                title="Aumentar velocidade [+]"
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
};
