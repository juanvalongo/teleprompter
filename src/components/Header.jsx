import { useState, useEffect, useRef } from 'react';
import {
  Layers,
  ChevronDown,
  Tv,
  Keyboard,
  User,
  Radio,
  FileEdit,
  Files,
  Activity,
  Sliders,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const Header = ({
  activeScreen,
  onNavigate,
  onNewScript,
  onOpenSecondScreen,
  onOpenShortcuts,
  onOpenScreenGallery,
  studioConfig,
  scriptsCount = 0,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(872);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimecode = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#12151D]/95 backdrop-blur-xl border-b border-[#282E3E] shadow-2xl select-none px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[60px] gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('teleprompter')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F2432] to-[#151821] border border-[#2D3546] flex items-center justify-center shadow-inner group-hover:border-[#EF4444]/60 transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]"></span>
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#F8FAFC]">
                ORATO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#1F2432] text-[#94A3B8] font-mono tracking-wider border border-[#2D3546] hidden sm:inline">
                PRO
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#181C26] border border-[#2D3546] shadow-sm text-[11px] font-mono">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#EF4444]"></span>
            </span>
            <span className="font-bold text-[#EF4444] tracking-wide">REC</span>
            <span className="text-[#64748B]">·</span>
            <span className="text-[#94A3B8] tabular-nums font-medium">
              {formatTimecode(secondsElapsed)}
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1 p-1 bg-[#181C26] rounded-2xl border border-[#282E3E] shadow-inner shrink-0">
          <button
            onClick={() => onNavigate('teleprompter')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeScreen === 'teleprompter'
                ? 'bg-[#EF4444] text-[#FFFFFF] shadow-md shadow-[#EF4444]/20 scale-[1.02]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>Teleprompter</span>
            {activeScreen === 'teleprompter' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => onNavigate('scripts')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeScreen === 'scripts'
                ? 'bg-[#EF4444] text-[#FFFFFF] shadow-md shadow-[#EF4444]/20 scale-[1.02]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Files className="w-3.5 h-3.5 shrink-0" />
            <span>Roteiros</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0C0E14] text-[#94A3B8] font-mono">
              {scriptsCount}
            </span>
          </button>

          <button
            onClick={() => onNavigate('editor')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeScreen === 'editor'
                ? 'bg-[#EF4444] text-[#FFFFFF] shadow-md shadow-[#EF4444]/20 scale-[1.02]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5 shrink-0" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => onNavigate('monitoring')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeScreen === 'monitoring'
                ? 'bg-[#EF4444] text-[#FFFFFF] shadow-md shadow-[#EF4444]/20 scale-[1.02]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>Telemetria</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeScreen === 'settings'
                ? 'bg-[#EF4444] text-[#FFFFFF] shadow-md shadow-[#EF4444]/20 scale-[1.02]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Configurações</span>
            <span className="md:hidden">Ajustes</span>
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onNewScript}
            className="w-8 h-8 rounded-xl bg-[#FACC15] text-[#0C0E14] flex items-center justify-center hover:bg-[#EAB308] transition-all shadow-md shadow-[#FACC15]/20 active:scale-95 shrink-0"
            title="Novo Roteiro"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={onOpenSecondScreen}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#181C26] text-[#F8FAFC] text-xs font-semibold hover:bg-[#1F2432] hover:text-[#EF4444] transition-all border border-[#282E3E] shadow-sm active:scale-95 whitespace-nowrap"
            title="Abrir teleprompter em modo 2ª tela HDMI para palco"
          >
            <Tv className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="hidden sm:inline">2ª Tela</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
              className="flex items-center px-2 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] gap-1 text-xs font-medium hover:bg-[#1F2432] hover:text-[#FFFFFF] transition-colors border border-[#282E3E]"
              title="Acesso rápido aos módulos"
            >
              <Layers className="w-3.5 h-3.5 text-[#EF4444]" />
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isNavDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isNavDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#151821] border border-[#2D3546] rounded-2xl shadow-2xl z-50 p-2 flex flex-col gap-1 backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#64748B] font-bold border-b border-[#282E3E] mb-1">
                  Módulos de Produção
                </div>

                <button
                  onClick={() => {
                    onNavigate('teleprompter');
                    setIsNavDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    activeScreen === 'teleprompter'
                      ? 'bg-[#1F2432] text-[#F8FAFC] font-semibold border border-[#EF4444]/40'
                      : 'text-[#94A3B8] hover:bg-[#1F2432] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>1. Teleprompter ao Vivo</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-mono font-bold">
                    PROMPTER
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('editor');
                    setIsNavDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    activeScreen === 'editor'
                      ? 'bg-[#1F2432] text-[#F8FAFC] font-semibold border border-[#EF4444]/40'
                      : 'text-[#94A3B8] hover:bg-[#1F2432] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileEdit className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>2. Editor de Roteiros</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181C26] text-[#94A3B8] font-mono border border-[#282E3E]">
                    Rich Text
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('scripts');
                    setIsNavDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    activeScreen === 'scripts'
                      ? 'bg-[#1F2432] text-[#F8FAFC] font-semibold border border-[#EF4444]/40'
                      : 'text-[#94A3B8] hover:bg-[#1F2432] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Files className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>3. Acervo de Roteiros</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181C26] text-[#94A3B8] font-mono border border-[#282E3E]">
                    {scriptsCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('monitoring');
                    setIsNavDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    activeScreen === 'monitoring'
                      ? 'bg-[#1F2432] text-[#F8FAFC] font-semibold border border-[#EF4444]/40'
                      : 'text-[#94A3B8] hover:bg-[#1F2432] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>4. Monitoramento STT</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FACC15]/20 text-[#FACC15] font-mono font-bold">
                    12ms
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsNavDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    activeScreen === 'settings'
                      ? 'bg-[#1F2432] text-[#F8FAFC] font-semibold border border-[#EF4444]/40'
                      : 'text-[#94A3B8] hover:bg-[#1F2432] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>5. Configurações de Estúdio</span>
                  </div>
                </button>

                <div className="border-t border-[#282E3E] mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsNavDropdownOpen(false);
                      onOpenScreenGallery();
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] text-[#EF4444] hover:bg-[#1F2432] font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3" />
                      Galeria de Módulos
                    </span>
                    <span className="text-[10px] text-[#64748B]">6 Telas</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] transition-colors border border-[#282E3E]"
            title="Atalhos de Teclado [?]"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-[#282E3E]">
            <div className="w-7 h-7 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#F8FAFC]">
              <User className="w-3.5 h-3.5 text-[#EF4444]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold text-[#F8FAFC] leading-none">
                {studioConfig?.operatorName || 'Operador Chefe'}
              </span>
              <span className="text-[10px] text-[#64748B] font-mono leading-tight mt-0.5">
                48 kHz · SYNC
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
