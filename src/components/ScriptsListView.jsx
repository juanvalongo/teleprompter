import { useState } from 'react';
import {
  Search,
  Plus,
  FileText,
  Play,
  Edit2,
  Trash2,
  X,
  Radio,
  Activity,
  Eye,
} from 'lucide-react';

export const ScriptsListView = ({
  scripts,
  onSelectScriptToPresent,
  onEditScript,
  onDeleteScript,
  onNewScript,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewScript, setPreviewScript] = useState(null);

  const filteredScripts = scripts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.plainText || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id, title) => {
    if (window.confirm(`Deseja realmente excluir o roteiro "${title}"?`)) {
      onDeleteScript(id);
      if (showToast) {
        showToast(`Roteiro "${title}" excluído com sucesso`, 'trash');
      }
    }
  };

  const totalEstimatedMin = scripts.reduce(
    (acc, s) => acc + (s.estimatedMinutes || 1),
    0
  );
  const featuredScript = scripts[0];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        {featuredScript && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#181C26] via-[#151821] to-[#12151D] border border-[#282E3E] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">
                  Roteiro em Destaque
                </span>
              </div>
              <span className="text-xs text-[#94A3B8] font-mono">
                {featuredScript.updatedAt}
              </span>
            </div>

            <div className="space-y-2 mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                {featuredScript.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
                "{(featuredScript.plainText || '').substring(0, 180)}..."
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#282E3E]">
              <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
                <span>
                  <strong className="text-[#FACC15] tabular-nums font-bold">
                    {featuredScript.wordCount}
                  </strong>{' '}
                  palavras
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[#FACC15] tabular-nums font-bold">
                    ~{featuredScript.estimatedMinutes} min
                  </strong>{' '}
                  leitura
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewScript(featuredScript)}
                  className="px-3 py-1.5 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:text-[#FFFFFF] text-xs font-semibold border border-[#2D3546] transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Prévia</span>
                </button>
                <button
                  onClick={() => onSelectScriptToPresent(featuredScript)}
                  className="px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all shadow-md shadow-[#FACC15]/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Apresentar Agora</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Estatísticas do Acervo
            </span>
            <Activity className="w-4 h-4 text-[#EF4444]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#12151D] border border-[#282E3E]">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold block mb-1">
                Roteiros
              </span>
              <span className="font-mono text-2xl font-bold text-[#FACC15] tabular-nums">
                {scripts.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#12151D] border border-[#282E3E]">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold block mb-1">
                Minutos Totais
              </span>
              <span className="font-mono text-2xl font-bold text-[#FACC15] tabular-nums">
                ~{totalEstimatedMin}m
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#181C26] border border-[#282E3E] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium">Reconhecimento de Voz:</span>
            <span className="font-mono font-bold text-[#EF4444] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
              48 kHz · PRONTO
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex items-center max-w-md w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar roteiro por título ou fala..."
            className="w-full bg-[#151821] text-[#F8FAFC] placeholder:text-[#64748B] text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] transition-colors shadow-inner"
          />
        </div>

        <button
          onClick={onNewScript}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all shadow-md shadow-[#FACC15]/20 active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Roteiro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScripts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#64748B] bg-[#151821] rounded-3xl border border-[#282E3E]">
            <FileText className="w-10 h-10 mx-auto mb-2 text-[#64748B]/40" />
            <p className="text-sm">
              {searchQuery
                ? `Nenhum roteiro encontrado para "${searchQuery}"`
                : 'Nenhum roteiro cadastrado no momento. Clique em "Novo Roteiro" para criar.'}
            </p>
          </div>
        ) : (
          filteredScripts.map((script) => (
            <div
              key={script.id}
              className="group p-5 rounded-3xl bg-[#151821] border border-[#282E3E] hover:border-[#EF4444]/40 hover:bg-[#181C26] transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#EF4444] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-lg bg-[#12151D] text-[#94A3B8] font-mono border border-[#282E3E]">
                    ~{script.estimatedMinutes} min
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#F8FAFC] transition-colors mb-1 truncate">
                  {script.title}
                </h3>

                <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed mb-4">
                  "{(script.plainText || '').substring(0, 140)}..."
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-3 border-t border-[#282E3E] mb-3">
                  <span className="font-mono">{script.wordCount} palavras</span>
                  <span>{script.updatedAt}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectScriptToPresent(script)}
                    title="Iniciar Apresentação no Teleprompter"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all shadow-md shadow-[#FACC15]/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Apresentar</span>
                  </button>

                  <button
                    onClick={() => onEditScript(script)}
                    title="Editar roteiro"
                    className="p-2 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#282E3E] transition-colors border border-[#2D3546]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(script.id, script.title)}
                    title="Excluir roteiro"
                    className="p-2 rounded-xl bg-[#1F2432] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#282E3E] transition-colors border border-[#2D3546]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {previewScript && (
        <div className="fixed inset-0 z-50 bg-[#0C0E14]/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-[#151821] p-6 rounded-3xl shadow-2xl flex flex-col space-y-4 border border-[#282E3E]">
            <div className="flex items-center justify-between pb-3 bg-[#181C26] px-4 py-2.5 rounded-2xl border border-[#282E3E]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse"></span>
                <span className="text-sm font-bold text-[#F8FAFC]">
                  {previewScript.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewScript(null)}
                className="text-[#94A3B8] hover:text-[#FFFFFF] p-1 rounded-lg hover:bg-[#1F2432]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#07080B] p-6 rounded-2xl text-center space-y-4 border border-[#282E3E]">
              <div className="flex items-center justify-center gap-2 text-[#EF4444] text-[11px] font-bold uppercase tracking-wider">
                <Radio className="w-4 h-4 text-[#EF4444]" />
                <span>Simulação de Leitura STT</span>
              </div>

              <p className="text-xl sm:text-2xl text-[#F8FAFC] font-medium leading-relaxed max-w-lg mx-auto">
                "{(previewScript.plainText || '').substring(0, 160)}..."
              </p>

              <div className="h-1.5 bg-[#1F2432] rounded-full overflow-hidden w-2/3 mx-auto mt-4">
                <div className="h-full bg-[#EF4444] w-1/3 animate-pulse"></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <span className="uppercase font-semibold">Cadência:</span>
                <span className="font-mono text-[#FACC15] font-bold px-2.5 py-0.5 rounded-lg bg-[#181C26] border border-[#282E3E]">
                  140 WPM
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewScript(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:bg-[#1F2432] hover:text-[#FFFFFF] transition-colors text-xs font-semibold border border-[#282E3E]"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    const toLaunch = previewScript;
                    setPreviewScript(null);
                    onSelectScriptToPresent(toLaunch);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] hover:bg-[#EAB308] transition-all text-xs font-bold shadow-md shadow-[#FACC15]/20"
                >
                  Apresentar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
