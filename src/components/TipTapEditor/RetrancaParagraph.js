import Paragraph from '@tiptap/extension-paragraph';

/**
 * Extensão de Parágrafo do TipTap adaptada com suporte a Retranca jornalística.
 * Persiste o atributo como data-type="retranca" e class="tiptap-paragraph tiptap-retranca-block".
 * Disponibiliza os comandos toggleRetranca/setRetranca e atalho de teclado Mod-Shift-s (Ctrl+Shift+S).
 */
export const RetrancaParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      retranca: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute('data-type') === 'retranca' ||
          element.classList?.contains('tiptap-retranca-block'),
        renderHTML: (attributes) => {
          if (!attributes.retranca) {
            return {
              class: 'tiptap-paragraph',
            };
          }
          return {
            'data-type': 'retranca',
            class: 'tiptap-paragraph tiptap-retranca-block',
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleRetranca:
        () =>
        ({ commands, editor }) => {
          if (editor.isActive('heading')) {
            return commands.setParagraph({ retranca: true });
          }
          const isRetranca = editor.isActive('paragraph', { retranca: true });
          return commands.updateAttributes('paragraph', {
            retranca: !isRetranca,
          });
        },
      setRetranca:
        (value = true) =>
        ({ commands, editor }) => {
          if (editor.isActive('heading')) {
            return commands.setParagraph({ retranca: value });
          }
          return commands.updateAttributes('paragraph', {
            retranca: value,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-Shift-s': () => this.editor.commands.toggleRetranca(),
      'Mod-Shift-S': () => this.editor.commands.toggleRetranca(),
    };
  },
});

export default RetrancaParagraph;
