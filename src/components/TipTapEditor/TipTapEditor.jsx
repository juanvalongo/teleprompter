import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Undo,
  Redo,
  WrapText,
  Tag,
} from 'lucide-react';
import { RetrancaParagraph } from './RetrancaParagraph';
import { parseRetranca } from '../../utils/retrancaParser';
import './TipTapEditor.css';

/**
 * Componente isolado de Toolbar para o TipTap
 */
const TipTapToolbar = ({ editor, showStats = true, wordCount = 0 }) => {
  if (!editor) return null;

  const estMin = Math.max(1, Math.ceil(wordCount / 130));

  return (
    <div className="sticky top-4 z-30 bg-[#151821]/95 backdrop-blur-xl p-2.5 rounded-2xl shadow-xl flex items-center justify-between flex-wrap gap-2 border border-[#282E3E]">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Bloco / Estrutura de Parágrafo, Retranca e Títulos */}
        <div className="flex items-center bg-[#12151D] p-1 rounded-xl border border-[#282E3E]">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph({ retranca: false }).run()}
            title="Parágrafo normal"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs ${
              editor.isActive('paragraph') &&
              !editor.isActive('heading') &&
              !editor.isActive('paragraph', { retranca: true })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Pilcrow className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleRetranca().run()}
            title="Marcar como Retranca [Ctrl+Shift+S]"
            className={`flex items-center gap-1.5 px-2.5 h-7 rounded-lg transition-all text-xs font-semibold ${
              editor.isActive('paragraph', { retranca: true })
                ? 'bg-[#1F2432] text-[#FACC15] border border-[#FACC15]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#FACC15]" />
            <span className="hidden sm:inline">Retranca</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Título 1 (H1)"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Título 2 (H2)"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Título 3 (H3)"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-[#282E3E] mx-1 hidden sm:block" />

        {/* Formatação Básica de Texto (Negrito, Itálico, Sublinhado) */}
        <div className="flex items-center bg-[#12151D] p-1 rounded-xl border border-[#282E3E]">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrito [Ctrl+B]"
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-colors text-xs ${
              editor.isActive('bold')
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#F8FAFC] hover:bg-[#1F2432]'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Itálico [Ctrl+I]"
            className={`w-7 h-7 rounded-lg flex items-center justify-center italic transition-colors text-xs font-serif ${
              editor.isActive('italic')
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Sublinhado [Ctrl+U]"
            className={`w-7 h-7 rounded-lg flex items-center justify-center underline transition-colors text-xs ${
              editor.isActive('underline')
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-[#282E3E] mx-1 hidden sm:block" />

        {/* Alinhamento de Texto (Esquerda, Centro, Direita) */}
        <div className="flex items-center bg-[#12151D] p-1 rounded-xl border border-[#282E3E]">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Alinhar à Esquerda"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Centralizar para Leitura de Palco"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Alinhar à Direita"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-[#1F2432] text-[#EF4444]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432]'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-[#282E3E] mx-1 hidden sm:block" />

        {/* Quebra de Linha / Hard Break */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#12151D] text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] transition-colors text-xs font-semibold border border-[#282E3E]"
          title="Quebra de Linha [Shift+Enter]"
        >
          <WrapText className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quebra</span>
        </button>

        <div className="w-px h-5 bg-[#282E3E] mx-1 hidden sm:block" />

        {/* Histórico: Desfazer e Refazer */}
        <div className="flex items-center bg-[#12151D] p-1 rounded-xl border border-[#282E3E]">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Desfazer [Ctrl+Z]"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-xs"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Refazer [Ctrl+Y]"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1F2432] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-xs"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Estatísticas (Palavras e Tempo Estimado) */}
      {showStats && (
        <div className="flex items-center gap-3 font-mono text-xs text-[#94A3B8] ml-auto">
          <span>
            <strong className="text-[#FACC15] tabular-nums">{wordCount}</strong>{' '}
            palavras
          </span>
          <span>·</span>
          <span>
            ~<strong className="text-[#FACC15] tabular-nums">{estMin}</strong> min
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Editor TipTap isolado para o Teleprompter
 *
 * Suporta:
 * - Parágrafos normais e blocos de Retranca jornalística (data-type="retranca")
 * - Títulos H1, H2, H3
 * - Negrito, Itálico, Sublinhado
 * - Alinhamento (Left, Center, Right)
 * - Hard Break (quebra de linha dentro do bloco)
 * - Undo / Redo
 * - Atalho Ctrl+Shift+S para alternar bloco atual como Retranca
 *
 * Props:
 * @param {string} value - Conteúdo HTML inicial ou controlado
 * @param {function} onChange - Callback disparado a cada alteração: (html, { text, json, wordCount, editor })
 * @param {boolean} showToolbar - Se deve exibir a barra de ferramentas (padrão: true)
 * @param {boolean} showStats - Se deve exibir contador de palavras na toolbar (padrão: true)
 * @param {boolean} editable - Se o editor está habilitado para edição (padrão: true)
 * @param {string} className - Classes CSS adicionais para o container externo
 */
export const TipTapEditor = ({
  value = '',
  onChange,
  showToolbar = true,
  showStats = true,
  editable = true,
  className = '',
}) => {
  const calculateWords = (text) => {
    const clean = (text || '').trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  };

  const initialContent = parseRetranca(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: {
          levels: [1, 2, 3],
        },
        hardBreak: {
          keepMarks: true,
        },
      }),
      RetrancaParagraph,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class:
          'min-h-[380px] w-full rounded-2xl bg-[#0C0E14] p-6 text-base sm:text-lg text-[#F8FAFC] leading-relaxed outline-none focus:ring-1 focus:ring-[#EF4444]/60 transition-colors select-text border border-[#282E3E] font-normal shadow-inner focus:outline-none',
        spellcheck: 'false',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      // Separação em blocos com quebra de linha para o teleprompter consumir
      const text = currentEditor.getText({ blockSeparator: '\n\n' });
      const wordCount = calculateWords(text);

      if (onChange) {
        onChange(html, {
          text,
          json: currentEditor.getJSON(),
          wordCount,
          editor: currentEditor,
        });
      }
    },
  });

  // Sincroniza alterações externas do prop `value` sem resetar desnecessariamente o cursor
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== undefined && value !== currentHtml) {
      const preparedValue = parseRetranca(value || '');
      if (preparedValue !== currentHtml) {
        editor.commands.setContent(preparedValue, false);
      }
    }
  }, [value, editor]);

  // Atualiza estado de edição quando a prop `editable` mudar
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editable, editor]);

  const currentPlainText = editor ? editor.getText({ blockSeparator: '\n\n' }) : '';
  const wordCount = calculateWords(currentPlainText);

  return (
    <div className={`flex flex-col gap-4 tiptap-editor-wrapper ${className}`}>
      {showToolbar && (
        <TipTapToolbar
          editor={editor}
          showStats={showStats}
          wordCount={wordCount}
        />
      )}

      <div className="bg-[#151821] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-3 border border-[#282E3E]">
        <div className="flex items-center justify-between pb-2 border-b border-[#282E3E]">
          <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
            Corpo do Texto do Teleprompter
          </span>
          <span className="text-[11px] text-[#64748B]">
            Use <kbd className="px-1.5 py-0.5 rounded bg-[#12151D] border border-[#282E3E] text-[#FACC15] font-mono text-[10px]">Ctrl+Shift+S</kbd> para marcar Retranca
          </span>
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;
