import { useState } from 'react';
import {
  Save,
  Mic,
  Eye,
  User,
  Check,
  RotateCcw,
} from 'lucide-react';

export const SettingsView = ({ config, onSaveConfig, showToast }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(localConfig);
    setSavedSuccess(true);
    showToast('Configurações do estúdio salvas com sucesso');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const resetDefaults = () => {
    const defaults = {
      microphone: 'Microfone Shure SM7B (Interface USB)',
      audioSampleRate: '48 kHz · SYNC',
      defaultWpm: 140,
      fontSize: 48,
      highContrast: true,
      operatorName: 'Operador Chefe',
      studioName: 'Estúdio Principal 01',
      mirrorMode: false,
      autoScrollEnabled: true,
    };
    setLocalConfig(defaults);
    onSaveConfig(defaults);
    showToast('Configurações restauradas para os padrões de fábrica');
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-[#151821] rounded-3xl border border-[#282E3E] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-[#64748B] text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Sistema</span>
            <span>·</span>
            <span className="text-[#EF4444]">Calibração de Estúdio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Parâmetros & Hardware
          </h1>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          className="px-3.5 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1F2432] text-xs font-semibold border border-[#282E3E] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Padrões</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#282E3E]">
            <div className="w-8 h-8 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#EF4444]">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC]">
                Dispositivos de Áudio & Captura STT
              </h2>
              <p className="text-xs text-[#64748B]">
                Interface de microfone e taxa de amostragem acústica
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Microfone Principal
              </label>
              <input
                type="text"
                value={localConfig.microphone}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, microphone: e.target.value })
                }
                className="w-full bg-[#12151D] text-[#F8FAFC] text-xs px-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] transition-colors shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Taxa de Amostragem do Driver
              </label>
              <select
                value={localConfig.audioSampleRate}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, audioSampleRate: e.target.value })
                }
                className="w-full bg-[#12151D] text-[#F8FAFC] text-xs px-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] transition-colors shadow-inner"
              >
                <option value="48 kHz · SYNC">48 kHz · Broadcast SYNC (Recomendado)</option>
                <option value="44.1 kHz · STD">44.1 kHz · Standard CD Quality</option>
                <option value="96 kHz · HD">96 kHz · Hi-Res Studio Master</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#282E3E]">
            <div className="w-8 h-8 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#EF4444]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC]">
                Óptica do Teleprompter & Visor de Palco
              </h2>
              <p className="text-xs text-[#64748B]">
                Velocidade WPM padrão, dimensão da fonte e reflexão em espelho
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Cadência WPM Padrão
              </label>
              <input
                type="number"
                min="80"
                max="260"
                step="5"
                value={localConfig.defaultWpm}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    defaultWpm: parseInt(e.target.value, 10) || 140,
                  })
                }
                className="w-full bg-[#12151D] text-[#F8FAFC] text-xs px-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] font-mono shadow-inner"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Padrão conversacional: 140 WPM
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Tamanho da Fonte (px)
              </label>
              <input
                type="number"
                min="24"
                max="80"
                step="4"
                value={localConfig.fontSize}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    fontSize: parseInt(e.target.value, 10) || 48,
                  })
                }
                className="w-full bg-[#12151D] text-[#F8FAFC] text-xs px-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] font-mono shadow-inner"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Padrão HDMI: 48px
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Espelho Horizontal Beam-Splitter
              </label>
              <button
                type="button"
                onClick={() =>
                  setLocalConfig({
                    ...localConfig,
                    mirrorMode: !localConfig.mirrorMode,
                  })
                }
                className={`w-full py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                  localConfig.mirrorMode
                    ? 'bg-[#EF4444] text-[#FFFFFF] border-[#EF4444] shadow-md shadow-[#EF4444]/20'
                    : 'bg-[#12151D] text-[#94A3B8] border-[#282E3E] hover:text-[#FFFFFF]'
                }`}
              >
                {localConfig.mirrorMode ? 'ATIVADO (Espelho 70/30)' : 'DESATIVADO (Normal)'}
              </button>
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Inverte o eixo X para espelhos ópticos
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#282E3E]">
            <div className="w-8 h-8 rounded-xl bg-[#1F2432] border border-[#2D3546] flex items-center justify-center text-[#EF4444]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC]">
                Operação & Identificação da Cabine
              </h2>
              <p className="text-xs text-[#64748B]">
                Metadados exibidos no cabeçalho e na rede de estúdios
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Nome do Operador
              </label>
              <input
                type="text"
                value={localConfig.operatorName}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, operatorName: e.target.value })
                }
                className="w-full bg-[#12151D] text-[#F8FAFC] text-xs px-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] transition-colors shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Identificador da Cabine / Estúdio
              </label>
              <input
                type="text"
                value={localConfig.studioName}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, studioName: e.target.value })
                }
                className="w-full bg-[#12151D] text-[#F8FAFC] text-xs px-4 py-2.5 rounded-2xl border border-[#282E3E] focus:outline-none focus:border-[#EF4444] transition-colors shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#FACC15] text-[#0C0E14] text-xs font-bold hover:bg-[#EAB308] transition-all flex items-center gap-2 shadow-lg shadow-[#FACC15]/20 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
