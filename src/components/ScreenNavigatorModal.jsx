import { useState } from 'react';
import {
  X,
  Layers,
  ArrowRight,
  Radio,
  FileEdit,
  Files,
  Tv,
  Activity,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  FileCode,
} from 'lucide-react';

export const ScreenNavigatorModal = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSecondScreen,
}) => {
  const [activeTab, setActiveTab] = useState('screens');
  const [copiedHash, setCopiedHash] = useState(null);

  if (!isOpen) return null;

  const handleCopyLink = (hash) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    });
  };

  const screens = [
    {
      id: 'teleprompter',
      hash: 'apresentacao',
      number: '01',
      title: 'Apresentação & Teleprompter STT',
      referenceLabel: 'Prompter ao Vivo',
      badge: 'AO VIVO',
      badgeColor: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
      icon: Radio,
      description:
        'Visor imersivo com Linha-Guia dos Olhos, sincronização de voz em tempo real (latência 12ms), destaque dinâmico da palavra ativa e controle de cadência WPM.',
      features: [
        'Fundo escuro puro e texto de alto contraste',
        'Linha-Guia dos Olhos com laser focal em Destaque',
        'Reconhecimento Ativo · Falando Agora (STT 99.8%)',
        'Sensibilidade e cadência ajustável (140 WPM)',
      ],
      actionText: 'Abrir Teleprompter',
    },
    {
      id: 'editor',
      hash: 'editor',
      number: '02',
      title: 'Editor de Roteiro',
      referenceLabel: 'Ambiente de Redação',
      badge: 'RICH TEXT',
      badgeColor: 'bg-[#181C26] text-[#94A3B8] border border-[#282E3E]',
      icon: FileEdit,
      description:
        'Ambiente de escrita com barra flutuante de formatação (Negrito, Itálico, Sublinhado, Destaque, Alinhamento), salvamento na API e estimativa de leitura.',
      features: [
        'Barra de formatação flutuante persistente',
        'Marcador de Destaque visual para orador',
        'Sincronização com backend /api/scripts',
        'Botão Iniciar Apresentação em destaque',
      ],
      actionText: 'Abrir Editor',
    },
    {
      id: 'scripts',
      hash: 'roteiros',
      number: '03',
      title: 'Meus Roteiros',
      referenceLabel: 'Acervo de Produção',
      badge: 'PRODUÇÃO',
      badgeColor: 'bg-[#181C26] text-[#94A3B8] border border-[#282E3E]',
      icon: Files,
      description:
        'Painel de gerenciamento de roteiros com busca instantânea, criação de novos textos, edição, exclusão e modal de pré-visualização rápida do teleprompter.',
      features: [
        'Busca e filtragem instantânea de roteiros',
        'Botão Apresentar com acionamento direto',
        'Modal de pré-visualização com leitor rápido',
        'Contador de palavras e tempo estimado',
      ],
      actionText: 'Ver Meus Roteiros',
    },
    {
      id: 'second-screen',
      hash: 'segunda-tela',
      number: '04',
      title: '2ª Tela Prompter (HDMI / Palco)',
      referenceLabel: 'Modo 2ª Tela',
      badge: 'HDMI 1080p',
      badgeColor: 'bg-[#EF4444] text-[#FFFFFF]',
      icon: Tv,
      description:
        'Tela cheia dedicada para monitores de retorno ou espelhos ópticos com tipografia display de 48px+, modo espelho (horizontal flip) e pop-out para 2º monitor.',
      features: [
        'Fundo escuro e tipografia de máxima legibilidade',
        'Modo Espelho para teleprompter com vidro 70/30',
        'Ajuste dinâmico de tamanho de fonte em tempo real',
        'Pop-out para janela independente no segundo monitor',
      ],
      actionText: 'Abrir 2ª Tela Prompter',
      isCustomAction: true,
    },
    {
      id: 'monitoring',
      hash: 'monitoramento',
      number: '05',
      title: 'Monitoramento IA & Telemetria',
      referenceLabel: 'Telemetria STT',
      badge: '48 kHz SYNC',
      badgeColor: 'bg-[#181C26] text-[#EF4444] border border-[#EF4444]/30',
      icon: Activity,
      description:
        'Diagnósticos acústicos em tempo real: latência (12ms), precisão fonética (99.8%), medidor VU de decibéis e log de eventos do motor neural.',
      features: [
        'Pipeline acústico em 3 fases estruturadas',
        'Visualização de nível de entrada de microfone',
        'Simulação de pausas respiratórias e desvios',
        'Log de eventos de sincronismo neural',
      ],
      actionText: 'Ver Telemetria IA',
    },
    {
      id: 'settings',
      hash: 'configuracoes',
      number: '06',
      title: 'Configurações de Estúdio',
      referenceLabel: 'Hardware & Áudio',
      badge: 'SETUP',
      badgeColor: 'bg-[#181C26] text-[#94A3B8] border border-[#282E3E]',
      icon: Sliders,
      description:
        'Configurações de interface de áudio, taxa de amostragem (48 kHz Broadcast SYNC), sensibilidade padrão de WPM e identificação do operador.',
      features: [
        'Seleção de dispositivo de microfone e taxa 48 kHz',
        'Ajuste de cadência padrão e zoom tipográfico',
        'Configuração de operador e cabine de estúdio',
        'Restaurar padrões de estúdio',
      ],
      actionText: 'Ver Configurações',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0E14]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-[#151821] rounded-3xl shadow-2xl border border-[#282E3E] flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#181C26] border-b border-[#282E3E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#EF4444]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                Navegador de Módulos do Estúdio ORATO
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Acesso direto a todas as telas do sistema com layout fluido e alta densidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#FFFFFF] p-1.5 rounded-xl hover:bg-[#1F2432] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#151821] border-b border-[#282E3E]">
          <button
            onClick={() => setActiveTab('screens')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'screens'
                ? 'bg-[#1F2432] text-[#EF4444] border border-[#2D3546]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Módulos Interativos</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'specs'
                ? 'bg-[#1F2432] text-[#EF4444] border border-[#2D3546]'
                : 'text-[#94A3B8] hover:text-[#FFFFFF]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Design System (80/15/5)</span>
          </button>
        </div>

        {activeTab === 'screens' ? (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screens.map((screen) => {
              const Icon = screen.icon;
              return (
                <div
                  key={screen.number}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-[#12151D] border border-[#282E3E] hover:border-[#EF4444]/40 hover:bg-[#181C26] transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-[#181C26] flex items-center justify-center text-[#FACC15] font-mono text-xs font-bold border border-[#282E3E]">
                          {screen.number}
                        </div>
                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                          {screen.referenceLabel}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${screen.badgeColor}`}
                      >
                        {screen.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-[#EF4444] shrink-0" />
                      <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#FFFFFF] transition-colors">
                        {screen.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
                      {screen.description}
                    </p>

                    <ul className="space-y-1 mb-4 text-[11px] text-[#94A3B8]">
                      {screen.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#EF4444] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        if (screen.isCustomAction) {
                          onOpenSecondScreen();
                        } else {
                          onNavigate(screen.id);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1F2432] text-[#F8FAFC] text-xs font-bold hover:bg-[#FACC15] hover:text-[#0C0E14] transition-all border border-[#2D3546] active:scale-95 shadow-sm"
                    >
                      <span>{screen.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopyLink(screen.hash)}
                      className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] text-[#64748B] hover:text-[#FACC15] hover:bg-[#181C26] transition-colors"
                    >
                      {copiedHash === screen.hash ? (
                        <>
                          <Check className="w-3 h-3 text-[#FACC15]" />
                          <span className="text-[#FACC15] font-bold">
                            Link Copiado!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Link Direto (#{screen.hash})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-5 rounded-2xl bg-[#12151D] border border-[#282E3E] space-y-3">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#EF4444]" />
                Constituição Visual & Distribuição Cromática Rigorosa
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Refatoração completa com hierarquia visual forte, layout fluido e proporção cromática estrita:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-4 rounded-xl bg-[#181C26] border border-[#282E3E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#F8FAFC]">80% Cinza Escuro</span>
                    <span className="text-[10px] font-mono text-[#64748B]">Base & Superfícies</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Backgrounds profundos (#0C0E14), cards flutuantes (#151821), bordas sutis (#282E3E) e tipografia neutra.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#181C26] border border-[#282E3E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#EF4444]">15% Vermelho</span>
                    <span className="text-[10px] font-mono text-[#64748B]">Apoio & Acentos</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Botões secundários, ícones funcionais, barras de nível VU, indicador REC/AO VIVO, e acentos de hover.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#181C26] border border-[#282E3E]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#FACC15]">5% Amarelo</span>
                    <span className="text-[10px] font-mono text-[#64748B]">Destaque Crítico</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    CTAs primários ("Apresentar", "Novo Roteiro"), métricas-chave (WPM, Latência 12ms) e marcação de palavras na leitura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-3.5 bg-[#181C26] border-t border-[#282E3E] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>
            Pressione <kbd className="px-2 py-0.5 rounded bg-[#12151D] border border-[#282E3E] font-mono text-[#FACC15]">Esc</kbd> para fechar a qualquer momento
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1F2432] text-[#F8FAFC] hover:bg-[#282E3E] text-xs font-semibold transition-colors border border-[#2D3546]"
          >
            Fechar Navegador
          </button>
        </div>
      </div>
    </div>
  );
};
