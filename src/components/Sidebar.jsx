import {
  FileText,
  FilePlus,
  Radio,
  Activity,
  Settings,
  UserCheck,
} from 'lucide-react';

export const Sidebar = ({
  activeScreen,
  onNavigate,
  onNewScript,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#060D1A] z-50 flex flex-col justify-between select-none border-r border-[#16284B] shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col">
        <div className="h-12 px-3.5 flex items-center justify-between bg-[#0B162C] border-b border-[#16284B]">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-[#FFFFFF]">
              ORATO
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#16284B] text-[#90A6CE] font-medium tracking-wide">
              ESTÚDIO v1.0
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#060D1A] text-[#00D2FF] text-[11px] font-semibold border border-[#00D2FF]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse"></span>
            STANDBY
          </div>
        </div>

        <div className="px-3.5 pt-5 pb-1">
          <span className="text-[11px] tracking-wider uppercase text-[#90A6CE]/80 font-semibold">
            Operação de Estúdio
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-2 pt-1">
          <button
            onClick={() => onNavigate('scripts')}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all ${
              activeScreen === 'scripts'
                ? 'bg-[#101E38] text-[#FFFFFF] font-semibold border-l-2 border-[#FF7A00] shadow-inner'
                : 'text-[#90A6CE] hover:bg-[#0B162C] hover:text-[#FFFFFF]'
            }`}
          >
            <FileText
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeScreen === 'scripts'
                  ? 'text-[#00D2FF]'
                  : 'text-[#90A6CE] group-hover:text-[#FFFFFF]'
              }`}
            />
            <span className="text-[13px]">Roteiros</span>
          </button>

          <button
            onClick={onNewScript}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all ${
              activeScreen === 'editor'
                ? 'bg-[#101E38] text-[#FFFFFF] font-semibold border-l-2 border-[#FF7A00] shadow-inner'
                : 'text-[#90A6CE] hover:bg-[#0B162C] hover:text-[#FFFFFF]'
            }`}
          >
            <FilePlus
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeScreen === 'editor'
                  ? 'text-[#00D2FF]'
                  : 'text-[#90A6CE] group-hover:text-[#FFFFFF]'
              }`}
            />
            <span className="text-[13px]">Novo Roteiro</span>
          </button>

          <button
            onClick={() => onNavigate('teleprompter')}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all ${
              activeScreen === 'teleprompter'
                ? 'bg-[#101E38] text-[#FFFFFF] font-semibold border-l-2 border-[#FF7A00] shadow-inner'
                : 'text-[#90A6CE] hover:bg-[#0B162C] hover:text-[#FFFFFF]'
            }`}
          >
            <Radio
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeScreen === 'teleprompter'
                  ? 'text-[#00D2FF]'
                  : 'text-[#90A6CE] group-hover:text-[#FFFFFF]'
              }`}
            />
            <span className="text-[13px]">Apresentações / Operador</span>
          </button>

          <button
            onClick={() => onNavigate('monitoring')}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all ${
              activeScreen === 'monitoring'
                ? 'bg-[#101E38] text-[#FFFFFF] font-semibold border-l-2 border-[#FF7A00] shadow-inner'
                : 'text-[#90A6CE] hover:bg-[#0B162C] hover:text-[#FFFFFF]'
            }`}
          >
            <Activity
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeScreen === 'monitoring'
                  ? 'text-[#00D2FF]'
                  : 'text-[#90A6CE] group-hover:text-[#FFFFFF]'
              }`}
            />
            <span className="text-[13px]">Monitoramento IA</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all ${
              activeScreen === 'settings'
                ? 'bg-[#101E38] text-[#FFFFFF] font-semibold border-l-2 border-[#FF7A00] shadow-inner'
                : 'text-[#90A6CE] hover:bg-[#0B162C] hover:text-[#FFFFFF]'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 transition-colors ${
                activeScreen === 'settings'
                  ? 'text-[#00D2FF]'
                  : 'text-[#90A6CE] group-hover:text-[#FFFFFF]'
              }`}
            />
            <span className="text-[13px]">Configurações</span>
          </button>
        </nav>
      </div>

      <div className="p-2.5 m-2.5 rounded bg-[#0B162C] border border-[#16284B]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#16284B]">
          <span className="text-[10px] text-[#90A6CE] uppercase tracking-wider font-semibold">
            Sessão Estúdio
          </span>
          <span className="font-mono text-[11px] text-[#00D2FF] font-medium">
            48 kHz · SYNC
          </span>
        </div>
        <div className="flex items-center gap-2.5 pt-2">
          <div className="w-7 h-7 rounded bg-[#16284B] flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4 text-[#90A6CE]" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] text-[#FFFFFF] truncate font-medium">
              Operador Chefe
            </span>
            <span className="text-[11px] text-[#90A6CE]/80 truncate">
              Estúdio Principal 01
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
