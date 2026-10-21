import { useState, useEffect, useRef } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  ExternalLink,
} from "lucide-react";

export const SecondScreenModal = ({ isOpen, onClose, script }) => {
  const [isMirrored, setIsMirrored] = useState(false);
  const [fontSize, setFontSize] = useState(48);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [syncData, setSyncData] = useState(() => {
    try {
      const saved = localStorage.getItem("orato_hdmi_initial_state");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      script: script,
      blocks: [],
      activeBlockIndex: 0,
      activeWordIndex: 0,
      isPlaying: false,
    };
  });

  useEffect(() => {
    const channel = new BroadcastChannel("orato_hdmi_sync");
    channel.onmessage = (event) => {
      setSyncData(event.data);
    };
    return () => channel.close();
  }, []);

  // =========================================================
  // ROLAGEM NATIVA: Foca exatamente na Micro-Âncora
  // =========================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      // Procura o ponto exato da leitura (a âncora invisível)
      const targetEl = document.getElementById(
        `hdmi-mark-${syncData.activeBlockIndex}`,
      );

      if (targetEl) {
        // block: 'center' alinha a âncora no meio da tela (com a nossa linha-guia)
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // Fallback de segurança
        const blockEl = document.getElementById(
          `hdmi-block-${syncData.activeBlockIndex}`,
        );
        if (blockEl)
          blockEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [syncData.activeBlockIndex, syncData.activeWordIndex]);

  const openSeparateWindow = () => {
    const currentScriptId = syncData.script?.id || script?.id || "";
    window.open(
      `${window.location.origin}/#hdmi-${currentScriptId}`,
      "ORATO_PROMPTER_HDMI",
      "width=1280,height=720",
    );
    onClose();
  };

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

  if (!isOpen && window.location.hash.indexOf("hdmi") === -1) return null;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 bg-[#000000] text-[#FFFFFF] flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="flex items-center justify-between px-6 py-3 bg-[#12151D]/95 border-b border-[#282E3E] z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF4444] text-[#FFFFFF] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            2ª TELA ESPELHO
          </div>
          <span className="text-sm font-bold text-[#F8FAFC]">
            {syncData.script?.title || "Teleprompter HDMI"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${isMirrored ? "bg-[#EF4444] text-[#FFFFFF] border-[#EF4444]" : "bg-[#181C26] text-[#94A3B8] border-[#282E3E]"}`}
          >
            <FlipHorizontal className="w-3.5 h-3.5 inline mr-1" /> Espelho{" "}
            {isMirrored ? "ON" : "OFF"}
          </button>

          <div className="flex items-center bg-[#181C26] rounded-xl border border-[#282E3E] px-2.5 py-1 text-xs text-[#94A3B8]">
            <button
              onClick={() => setFontSize((p) => Math.max(32, p - 4))}
              className="w-5 h-5 hover:text-white"
            >
              A-
            </button>
            <span className="font-mono px-2 text-[#FACC15] font-bold">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize((p) => Math.min(80, p + 4))}
              className="w-5 h-5 hover:text-white"
            >
              A+
            </button>
          </div>

          <button
            onClick={openSeparateWindow}
            className="px-3 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] border border-[#282E3E] text-xs font-semibold hover:text-[#FFFFFF]"
          >
            <ExternalLink className="w-3.5 h-3.5 inline mr-1" /> Nova Janela
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] border border-[#282E3E] hover:text-[#FFFFFF]"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:bg-[#EF4444] hover:text-[#FFFFFF] border border-[#2D3546]"
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
        className={`flex-1 overflow-y-auto px-10 md:px-28 py-[50vh] scroll-smooth bg-[#000000] ${isMirrored ? "scale-x-[-1]" : ""}`}
      >
        <div
          className="max-w-4xl mx-auto font-medium tracking-tight leading-relaxed text-[#FFFFFF]"
          style={{ fontSize: `${fontSize}px` }}
        >
          {!syncData.blocks || syncData.blocks.length === 0 ? (
            <div className="text-center text-[#64748B] text-2xl mt-20 animate-pulse">
              Iniciando sistema de projeção...
            </div>
          ) : (
            syncData.blocks.map((block, idx) => {
              const isActive = idx === syncData.activeBlockIndex;
              const isPast = idx < syncData.activeBlockIndex;
              const spokenWords = isActive
                ? block.words.slice(0, syncData.activeWordIndex).join(" ")
                : "";
              const remainingWords = isActive
                ? block.words.slice(syncData.activeWordIndex).join(" ")
                : block.text;

              return (
                <div
                  key={block.id}
                  id={`hdmi-block-${idx}`}
                  className={`mb-12 transition-all duration-500 ${isActive ? "opacity-100 scale-105" : isPast ? "opacity-25" : "opacity-40"}`}
                >
                  {isActive ? (
                    <>
                      <span>{spokenWords}</span>
                      {/* MICRO-ÂNCORA: Fica exatamente onde a leitura está no momento */}
                      <span
                        id={`hdmi-mark-${idx}`}
                        style={{
                          display: "inline-block",
                          width: "1px",
                          height: "1px",
                        }}
                      ></span>
                      {spokenWords && remainingWords ? " " : ""}
                      <span>{remainingWords}</span>
                    </>
                  ) : (
                    <span>{block.text}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
