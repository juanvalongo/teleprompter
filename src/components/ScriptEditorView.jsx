import { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  Trash2,
  Save,
  Play,
  Edit3,
  Bold,
  Italic,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  Check,
} from 'lucide-react';

export const ScriptEditorView = ({
  script,
  onSave,
  onDelete,
  onCancel,
  onStartPresentation,
}) => {
  const [title, setTitle] = useState(script.title);
  const [contentHtml, setContentHtml] = useState(script.content);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== script.content) {
      editorRef.current.innerHTML = script.content;
    }
  }, [script.content]);

  const executeCommand = (command, value = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    document.execCommand('backColor', false, '#FACC15');
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  const calculateWordCount = (text) => {
    const clean = (text || '').replace(/<[^>]*>/g, ' ').trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  };

  const handleSave = () => {
    const html = editorRef.current ? editorRef.current.innerHTML : contentHtml;
    const plain = editorRef.current ? editorRef.current.innerText : '';
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
    const html = editorRef.current ? editorRef.current.innerHTML : contentHtml;
    const plain = editorRef.current ? editorRef.current.innerText : '';
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

  const currentWords = calculateWordCount(contentHtml);
  const currentEstMin = Math.max(1, Math.ceil(currentWords / 130));

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

      <div className="sticky top-4 z-30 bg-[#151821]/95 backdrop-blur-xl p-2.5 rounded-2xl shadow-xl flex items-center justify-between flex-wrap gap-2 border border-[#282E3E]">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center bg-[#12151D] p-1 rounded-xl border border-[#282E3E]">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Negrito [Ctrl+B]"
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[#F8FAFC] hover:bg-[#1F2432] transition-colors text-xs"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Itálico [Ctrl+I]"
              className="w-7 h-7 rounded-lg flex items-center justify-center italic text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] transition-colors text-xs font-serif"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Sublinhado"
              className="w-7 h-7 rounded-lg flex items-center justify-center underline text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] transition-colors text-xs"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-[#282E3E] mx-1 hidden sm:block"></div>

          <button
            type="button"
            onClick={handleHighlight}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12151D] text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] transition-colors text-xs font-semibold border border-[#282E3E]"
            title="Destacar termos chave em amarelo para o orador"
          >
            <Highlighter className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Destaque</span>
          </button>

          <div className="w-px h-5 bg-[#282E3E] mx-1 hidden sm:block"></div>

          <div className="flex items-center bg-[#12151D] p-1 rounded-xl border border-[#282E3E]">
            <button
              type="button"
              onClick={() => {
                setAlignment('left');
                executeCommand('justifyLeft');
              }}
              title="Alinhar à Esquerda"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                alignment === 'left'
                  ? 'bg-[#1F2432] text-[#EF4444]'
                  : 'text-[#94A3B8] hover:bg-[#1F2432]'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setAlignment('center');
                executeCommand('justifyCenter');
              }}
              title="Centralizar para Leitura de Palco"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                alignment === 'center'
                  ? 'bg-[#1F2432] text-[#EF4444]'
                  : 'text-[#94A3B8] hover:bg-[#1F2432]'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#94A3B8]">
          <span>
            <strong className="text-[#FACC15] tabular-nums">
              {currentWords}
            </strong>{' '}
            palavras
          </span>
          <span>·</span>
          <span>
            ~
            <strong className="text-[#FACC15] tabular-nums">
              {currentEstMin}
            </strong>{' '}
            min
          </span>
        </div>
      </div>

      <div className="bg-[#151821] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-3 border border-[#282E3E]">
        <div className="flex items-center justify-between pb-2 border-b border-[#282E3E]">
          <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
            Corpo do Texto do Teleprompter
          </span>
          <span className="text-[11px] text-[#64748B]">
            Parágrafos divididos automaticamente em blocos na rolagem
          </span>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            if (editorRef.current) {
              setContentHtml(editorRef.current.innerHTML);
            }
          }}
          className="min-h-[380px] w-full rounded-2xl bg-[#0C0E14] p-6 text-base sm:text-lg text-[#F8FAFC] leading-relaxed outline-none focus:ring-1 focus:ring-[#EF4444]/60 transition-colors select-text border border-[#282E3E] font-normal shadow-inner"
          spellCheck="false"
        />
      </div>

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
