import { useState } from 'react';
import {
  ChevronRight,
  Trash2,
  Save,
  Play,
  Edit3,
  Check,
} from 'lucide-react';
import { TipTapEditor } from './TipTapEditor';

export const ScriptEditorView = ({
  script,
  onSave,
  onDelete,
  onCancel,
  onStartPresentation,
}) => {
  const [prevScriptId, setPrevScriptId] = useState(script?.id);
  const [title, setTitle] = useState(script?.title || '');
  const [contentHtml, setContentHtml] = useState(script?.content || '');
  const [plainText, setPlainText] = useState(script?.plainText || '');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Sincroniza o estado caso o roteiro selecionado mude sem desmontar o componente
  if (script?.id !== prevScriptId) {
    setPrevScriptId(script?.id);
    setTitle(script?.title || '');
    setContentHtml(script?.content || '');
    setPlainText(script?.plainText || '');
  }

  const calculateWordCount = (text) => {
    const clean = (text || '').replace(/<[^>]*>/g, ' ').trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  };

  const handleSave = () => {
    const html = contentHtml;
    const plain = plainText || (contentHtml || '').replace(/<[^>]*>/g, ' ').trim();
    const words = calculateWordCount(plain);

    const updated = {
      ...script,
      title: title.trim() || 'Roteiro Sem Título',
      content: html,
      plainText: plain,
      wordCount: words,
      estimatedMinutes: Math.max(1, Math.ceil(words / 130)),
      updatedAt: 'Salvo agora',
    };

    onSave(updated);
    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
    }, 2000);
  };

  const handleLaunch = () => {
    const html = contentHtml;
    const plain = plainText || (contentHtml || '').replace(/<[^>]*>/g, ' ').trim();
    const words = calculateWordCount(plain);
    const updated = {
      ...script,
      title: title.trim() || 'Roteiro Sem Título',
      content: html,
      plainText: plain,
      wordCount: words,
      estimatedMinutes: Math.max(1, Math.ceil(words / 130)),
      updatedAt: 'Salvo agora',
    };
    onStartPresentation(updated);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-16 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#151821] rounded-3xl border border-[#282E3E] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#64748B] text-[11px] font-semibold uppercase tracking-wider">
            <button
              onClick={onCancel}
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Roteiros
            </button>
            <ChevronRight className="w-3 h-3 text-[#64748B]" />
            <span className="text-[#EF4444]">Editor de Roteiro</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
              Redação & Marcação
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181C26] text-[#EF4444] text-[10px] font-bold border border-[#2D3546]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"></span>
              Auto-Save Ativo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onDelete(script.id)}
            type="button"
            className="px-3 py-1.5 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Excluir este roteiro"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>

          <button
            onClick={onCancel}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] text-xs font-medium hover:bg-[#1F2432] hover:text-[#FFFFFF] transition-colors border border-[#282E3E]"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            type="button"
            className="px-4 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] text-xs font-semibold hover:bg-[#282E3E] transition-colors flex items-center gap-1.5 border border-[#2D3546] shadow-sm"
          >
            {isSavedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#FACC15]" />
                <span className="text-[#FACC15] font-bold">Salvo!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>Salvar</span>
              </>
            )}
          </button>

          <button
            onClick={handleLaunch}
            type="button"
            className="px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all flex items-center gap-1.5 shadow-md shadow-[#FACC15]/20 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Iniciar Apresentação</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-xl">
        <label
          className="block text-[10px] text-[#64748B] uppercase tracking-wider font-bold mb-1.5"
          htmlFor="script-title"
        >
          Título do Roteiro
        </label>
        <div className="relative flex items-center">
          <input
            id="script-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do roteiro..."
            className="w-full bg-[#12151D] text-[#F8FAFC] text-base sm:text-lg px-4 py-2.5 rounded-2xl border border-[#282E3E] outline-none focus:border-[#EF4444] transition-colors font-bold shadow-inner"
          />
          <Edit3 className="w-4 h-4 absolute right-4 text-[#64748B] pointer-events-none" />
        </div>
      </div>

      {/* Editor TipTap com Toolbar integrada */}
      <TipTapEditor
        value={contentHtml}
        onChange={(html, { text }) => {
          setContentHtml(html);
          setPlainText(text);
        }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#151821] rounded-2xl border border-[#282E3E] shadow-lg">
        <span className="text-xs text-[#64748B] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
          Sincronizado com o servidor
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] text-xs font-semibold hover:bg-[#1F2432] hover:text-[#FFFFFF] transition-colors border border-[#282E3E]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] text-xs font-semibold hover:bg-[#282E3E] transition-colors flex items-center gap-1.5 border border-[#2D3546]"
          >
            <Save className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Salvar Roteiro</span>
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            className="px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all flex items-center gap-1.5 shadow-md shadow-[#FACC15]/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Iniciar Apresentação</span>
          </button>
        </div>
      </div>
    </div>
  );
};
