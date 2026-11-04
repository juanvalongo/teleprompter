import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Espaço', action: 'Play / Pause', description: 'Alterna entre pausar e retomar a rolagem do teleprompter' },
    { key: '↑ / ↓', action: 'Ajuste Manual', description: 'Move o texto suavemente para cima ou para baixo' },
    { key: '+ / -', action: 'Velocidade WPM', description: 'Acelera ou reduz a cadência de palavras por minuto' },
    { key: 'M', action: 'Microfone STT', description: 'Ativa ou silencia a captura contínua de voz' },
    { key: 'F', action: 'Tela Cheia', description: 'Entra ou sai do modo imersivo de apresentação' },
    { key: '2', action: '2ª Tela Prompter', description: 'Abre a interface espelhada para saída HDMI de palco' },
    { key: 'Ctrl+Shift+S', action: 'Retranca', description: 'Marca ou desmarca o bloco atual como Retranca no editor' },
    { key: 'E', action: 'Editor', description: 'Abre o editor de roteiro ativo' },
    { key: 'R', action: 'Lista de Roteiros', description: 'Retorna para a listagem geral de roteiros' },
    { key: 'Esc', action: 'Fechar Janelas', description: 'Fecha modais, menus suspensos ou encerra modo tela cheia' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0E14]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#151821] rounded-3xl shadow-2xl border border-[#282E3E] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#181C26] border-b border-[#282E3E]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#EF4444]">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              Atalhos de Teclado do Estúdio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#FFFFFF] p-1.5 rounded-xl hover:bg-[#1F2432] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#12151D] border border-[#282E3E] hover:border-[#EF4444]/40 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#F8FAFC]">
                  {sc.action}
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  {sc.description}
                </span>
              </div>
              <kbd className="px-3 py-1 rounded-xl bg-[#181C26] text-[#FACC15] font-mono text-xs font-bold border border-[#2D3546] shadow-inner shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-3.5 bg-[#181C26] border-t border-[#282E3E] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1F2432] text-[#F8FAFC] text-xs font-semibold hover:bg-[#282E3E] hover:text-[#EF4444] transition-colors border border-[#2D3546]"
          >
            Fechar [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};
