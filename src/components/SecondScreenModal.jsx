import { useState, useEffect, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

export const SecondScreenModal = ({ isOpen, onClose, script }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [wpm, setWpm] = useState(140);
  const [isMirrored, setIsMirrored] = useState(false);
  const [fontSize, setFontSize] = useState(48);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ top: 1, behavior: 'auto' });
      }
    }, Math.max(25, Math.floor(5500 / (wpm / 10))));

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, wpm]);

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const openSeparateWindow = () => {
    const prompterWindow = window.open(
      '',
      'ORATO_PROMPTER_HDMI',
      'width=1280,height=720,menubar=no,toolbar=no'
    );
    if (prompterWindow) {
      prompterWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>ORATO — 2ª Tela (Prompter HDMI)</title>
          <style>
            body {
              margin: 0;
              background: #000000;
              color: #FFFFFF;
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              overflow-y: auto;
              padding: 4rem 2rem;
              text-align: center;
              line-height: 1.45;
            }
            .display-text {
              font-size: 3.2rem;
              max-width: 950px;
              font-weight: 500;
              letter-spacing: -0.01em;
            }
            .eye-line {
              position: fixed;
              top: 50%;
              left: 0;
              right: 0;
              height: 2px;
              background: rgba(250, 204, 21, 0.5);
              pointer-events: none;
            }
          </style>
        </head>
        <body>
          <div class="eye-line"></div>
          <div class="display-text">
            ${script?.content || ''}
          </div>
        </body>
        </html>
      `);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 bg-[#000000] text-[#FFFFFF] flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="flex items-center justify-between px-6 py-3 bg-[#12151D]/95 backdrop-blur-xl border-b border-[#282E3E] z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444] text-[#FFFFFF] text-[11px] font-bold tracking-wider uppercase shadow-md shadow-[#EF4444]/20">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            2ª TELA · SAÍDA HDMI
          </div>
          <span className="text-sm font-bold text-[#F8FAFC] truncate max-w-xs sm:max-w-md">
            {script?.title || 'Sem roteiro'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isMirrored
                ? 'bg-[#EF4444] text-[#FFFFFF] border-[#EF4444] shadow-md shadow-[#EF4444]/20'
                : 'bg-[#181C26] text-[#94A3B8] border-[#282E3E] hover:text-[#FFFFFF]'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Espelho {isMirrored ? 'ON' : 'OFF'}</span>
          </button>

          <div className="flex items-center bg-[#181C26] rounded-xl border border-[#282E3E] px-2.5 py-1 text-xs text-[#94A3B8]">
            <span className="mr-2 font-mono text-[11px]">Fonte:</span>
            <button
              onClick={() => setFontSize((prev) => Math.max(32, prev - 4))}
              className="w-5 h-5 flex items-center justify-center font-bold hover:text-white"
            >
              A-
            </button>
            <span className="font-mono px-2 text-[#FACC15] font-bold">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize((prev) => Math.min(80, prev + 4))}
              className="w-5 h-5 flex items-center justify-center font-bold hover:text-white"
            >
              A+
            </button>
          </div>

          <button
            onClick={openSeparateWindow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#FFFFFF] border border-[#282E3E] text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova Janela</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#FFFFFF] border border-[#282E3E]"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:bg-[#EF4444] hover:text-[#FFFFFF] transition-colors border border-[#2D3546]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="fixed top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-20 flex items-center px-8">
        <div className="h-[2px] w-full bg-[#FACC15]/40 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.5)]"></div>
        <span className="ml-4 px-3 py-1 rounded-xl bg-[#151821] border border-[#FACC15]/40 font-mono text-xs text-[#FACC15] font-bold uppercase tracking-widest whitespace-nowrap shadow-xl">
          Foco da Câmera
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-6 sm:px-16 md:px-28 py-44 scroll-smooth bg-[#000000] ${
          isMirrored ? 'scale-x-[-1]' : ''
        }`}
      >
        <div
          className="max-w-4xl mx-auto font-medium tracking-tight leading-relaxed text-[#FFFFFF]"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: script?.content || '' }}
            className="space-y-12"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-2.5 bg-[#12151D]/95 backdrop-blur-xl border-t border-[#282E3E] z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all shadow-md shadow-[#FACC15]/20"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#0C0E14]" />
                <span>Pausar [Espaço]</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#0C0E14]" />
                <span>Retomar [Espaço]</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    top: -100,
                    behavior: 'smooth',
                  });
                }
              }}
              className="p-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#FFFFFF] border border-[#282E3E]"
            >
              <ChevronUp className="w-4 h-4 text-[#EF4444]" />
            </button>
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    top: 100,
                    behavior: 'smooth',
                  });
                }
              }}
              className="p-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#FFFFFF] border border-[#282E3E]"
            >
              <ChevronDown className="w-4 h-4 text-[#EF4444]" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-mono">
          <span>CADÊNCIA:</span>
          <span className="font-bold text-[#FACC15] tabular-nums">
            {wpm} WPM
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWpm((prev) => Math.max(80, prev - 10))}
              className="w-6 h-6 rounded-lg bg-[#181C26] flex items-center justify-center font-bold hover:text-white border border-[#282E3E]"
            >
              -
            </button>
            <button
              onClick={() => setWpm((prev) => Math.min(260, prev + 10))}
              className="w-6 h-6 rounded-lg bg-[#181C26] flex items-center justify-center font-bold hover:text-white border border-[#282E3E]"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
