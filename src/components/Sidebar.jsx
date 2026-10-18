import { useState } from 'react';
import {
  FileText,
  FilePlus,
  Radio,
  Activity,
  Settings,
  UserCheck,
  Search,
  Play,
  Edit2,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react';

export const Sidebar = ({
  activeScreen,
  onNavigate,
  onNewScript,
  onClose,
  scripts = [],
  activeScriptId,
  onSelectScriptToPresent,
  onEditScript,
  onDeleteScript,
  onRefreshScripts,
  isLoading,
  apiError,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScripts = scripts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.plainText || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (e, id, title) => {
    e.stopPropagation();
    if (window.confirm(`Deseja realmente excluir o roteiro "${title}"?`)) {
      onDeleteScript(id);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#060D1A] z-50 flex flex-col justify-between select-none border-r border-[#16284B] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col min-h-0 flex-1">
        <div className="h-12 px-3.5 flex items-center justify-between bg-[#0B162C] border-b border-[#16284B] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-[#FFFFFF]">
              ORATO
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#16284B] text-[#90A6CE] font-medium tracking-wide">
              ESTÚDIO v1.0
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#060D1A] text-[#00D2FF] text-[10px] font-semibold border border-[#00D2FF]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse"></span>
              {apiError ? 'OFFLINE' : 'STANDBY'}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded text-[#90A6CE] hover:text-white hover:bg-[#16284B] transition-colors"
                title="Fechar barra lateral"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="px-3.5 pt-4 pb-1 shrink-0">
          <span className="text-[11px] tracking-wider uppercase text-[#90A6CE]/80 font-semibold">
            Operação de Estúdio
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-2 pt-1 shrink-0">
          <button
            onClick={() => onNavigate('scripts')}
            className={`group flex items-center justify-between px-2.5 py-2 rounded text-left transition-all ${
              activeScreen === 'scripts'
                ? 'bg-[#101E38] text-[#FFFFFF] font-semibold border-l-2 border-[#FF7A00] shadow-inner'
                : 'text-[#90A6CE] hover:bg-[#0B162C] hover:text-[#FFFFFF]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeScreen === 'scripts'
                    ? 'text-[#00D2FF]'
                    : 'text-[#90A6CE] group-hover:text-[#FFFFFF]'
                }`}
              />
              <span className="text-[13px]">Roteiros</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0B162C] text-[#90A6CE] font-mono border border-[#16284B]">
              {scripts.length}
            </span>
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

        <div className="flex flex-col min-h-0 flex-1 mt-3 border-t border-[#16284B] pt-3 px-2.5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] tracking-wider uppercase text-[#90A6CE]/80 font-semibold">
              Listagem de Roteiros
            </span>
            {onRefreshScripts && (
              <button
                onClick={onRefreshScripts}
                className="p-1 rounded text-[#90A6CE] hover:text-white hover:bg-[#0B162C] transition-colors"
                title="Atualizar lista do servidor"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#00D2FF]' : ''}`} />
              </button>
            )}
          </div>

          <div className="relative flex items-center mb-2">
            <Search className="w-3.5 h-3.5 text-[#90A6CE]/60 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar roteiro..."
              className="w-full bg-[#0B162C] text-[#FFFFFF] placeholder:text-[#90A6CE]/50 text-xs pl-8 pr-2.5 py-1.5 rounded border border-[#16284B] focus:outline-none focus:border-[#00D2FF]"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-[#90A6CE]/70">
                Carregando roteiros do backend...
              </div>
            ) : apiError ? (
              <div className="p-3 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11px] text-[#EF4444] space-y-1.5">
                <p className="font-semibold">Erro ao conectar na API:</p>
                <p className="text-[10px] opacity-90">{apiError}</p>
                {onRefreshScripts && (
                  <button
                    onClick={onRefreshScripts}
                    className="mt-1 px-2 py-1 rounded bg-[#EF4444] text-white text-[10px] font-bold"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            ) : filteredScripts.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#90A6CE]/60">
                Nenhum roteiro cadastrado no servidor.
              </div>
            ) : (
              filteredScripts.map((script) => {
                const isCurrent = script.id === activeScriptId;
                return (
                  <div
                    key={script.id}
                    onClick={() => onSelectScriptToPresent && onSelectScriptToPresent(script)}
                    className={`group p-2.5 rounded border cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#101E38] border-[#FF7A00]/60 text-white'
                        : 'bg-[#0B162C]/60 border-[#16284B] text-[#90A6CE] hover:bg-[#0B162C] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-white truncate">
                        {script.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#00D2FF] shrink-0">
                        ~{script.estimatedMinutes}m
                      </span>
                    </div>

                    <p className="text-[11px] text-[#90A6CE]/80 line-clamp-1 mb-2">
                      {script.plainText || 'Sem conteúdo'}
                    </p>

                    <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[#16284B]/80">
                      <span className="text-[10px] font-mono text-[#90A6CE]/70">
                        {script.wordCount} pal.
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectScriptToPresent) onSelectScriptToPresent(script);
                          }}
                          title="Apresentar no Teleprompter"
                          className="p-1 rounded bg-[#FF7A00] text-white hover:bg-[#FF7A00]/80 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEditScript) onEditScript(script);
                          }}
                          title="Editar roteiro"
                          className="p-1 rounded bg-[#16284B] text-[#90A6CE] hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, script.id, script.title)}
                          title="Excluir roteiro"
                          className="p-1 rounded bg-[#16284B] text-[#90A6CE] hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="p-2.5 m-2.5 rounded bg-[#0B162C] border border-[#16284B] shrink-0">
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
