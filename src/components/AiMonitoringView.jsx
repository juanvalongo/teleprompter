import { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Mic,
  Gauge,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const AiMonitoringView = () => {
  const [latency, setLatency] = useState(12);
  const [accuracy] = useState(99.8);
  const [currentWpm] = useState(142);
  const [audioLevel, setAudioLevel] = useState(68);
  const [logs, setLogs] = useState([
    { id: 1, time: '14:04:12', event: 'Sincronização 48 kHz iniciada com buffer de 12ms', status: 'ok' },
    { id: 2, time: '14:04:15', event: 'STT engine carregado: pt-BR modelo neural ultraleve', status: 'ok' },
    { id: 3, time: '14:04:22', event: 'Cadência do apresentador estabilizada em 140 WPM', status: 'info' },
    { id: 4, time: '14:04:28', event: 'Alinhamento palavra-por-palavra travado no bloco ativo', status: 'ok' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(10 + Math.random() * 4));
      setAudioLevel(Math.floor(58 + Math.random() * 22));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const addTestLog = (event, status) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => [{ id: Date.now(), time: timeStr, event, status }, ...prev.slice(0, 8)]);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-[#151821] rounded-3xl border border-[#282E3E] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-[#64748B] text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Diagnósticos Acústicos</span>
            <span>·</span>
            <span className="text-[#EF4444]">Motor Neural STT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Telemetria & Inteligência de Fala
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181C26] border border-[#2D3546] self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]"></span>
          <span className="font-mono text-xs text-[#F8FAFC] font-semibold">
            STATUS: NOMINAL (48 kHz)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#151821] border border-[#282E3E] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
              Latência de Reconhecimento
            </span>
            <Zap className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="my-2">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#FACC15] tabular-nums">
              {latency} ms
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] font-medium pt-2 border-t border-[#282E3E]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>Resposta em tempo real</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#151821] border border-[#282E3E] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
              Precisão Fonética
            </span>
            <Activity className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="my-2">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tabular-nums">
              {accuracy}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] font-medium pt-2 border-t border-[#282E3E]">
            <span>Vocabulário PT-BR neural</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#151821] border border-[#282E3E] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
              Cadência do Orador
            </span>
            <Gauge className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="my-2">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#FACC15] tabular-nums">
              {currentWpm} WPM
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] font-medium pt-2 border-t border-[#282E3E]">
            <span>Ritmo conversacional ideal</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#151821] border border-[#282E3E] flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
              Entrada de Áudio
            </span>
            <Mic className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="my-2 flex items-baseline">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tabular-nums">
              -{audioLevel} dB
            </span>
          </div>
          <div className="w-full bg-[#12151D] h-2.5 rounded-full overflow-hidden flex border border-[#282E3E] mt-1">
            <div
              className="bg-[#EF4444] h-full transition-all duration-300 shadow-[0_0_8px_#EF4444]"
              style={{ width: `${Math.min(100, (100 - audioLevel) * 2)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-2xl">
        <h2 className="text-base font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#EF4444]" />
          Pipeline de Teleprompter Inteligente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#12151D] border border-[#282E3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#EF4444] font-bold">
                FASE 1: CAPTURA ACÚSTICA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Stream de áudio PCM 48 kHz filtrado com cancelamento de ruído ambiente e Voice Activity Detector (VAD).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#12151D] border border-[#282E3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#FACC15] font-bold">
                FASE 2: RECONHECIMENTO NEURAL
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Decodificação fonética em tempo real (latência ~12ms). Combinação fonética com o texto do roteiro.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#12151D] border border-[#282E3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#EF4444] font-bold">
                FASE 3: ROLAGEM ADAPTATIVA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Ajuste dinâmico de scroll vertical sem oscilação. Congela na linha de foco em pausas respiratórias.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#151821] border border-[#282E3E] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#282E3E] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Log de Eventos do Motor IA
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181C26] text-[#EF4444] font-bold border border-[#2D3546]">
              LIVE STREAM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addTestLog('Pausa natural detectada: motor aguardando orador', 'info')}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#181C26] text-[#94A3B8] hover:text-[#FFFFFF] border border-[#282E3E] transition-colors"
            >
              Simular Pausa
            </button>
            <button
              onClick={() => addTestLog('Desvio de roteiro detectado (Improviso)', 'warn')}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25 border border-[#EF4444]/30 transition-colors font-semibold"
            >
              Simular Desvio
            </button>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-[#12151D] border border-[#282E3E]"
            >
              <span className="text-[#64748B] shrink-0 font-medium">{log.time}</span>
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] shrink-0 font-bold uppercase ${
                  log.status === 'ok'
                    ? 'bg-[#181C26] text-[#EF4444] border border-[#EF4444]/30'
                    : log.status === 'warn'
                    ? 'bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40'
                    : 'bg-[#181C26] text-[#94A3B8] border border-[#2D3546]'
                }`}
              >
                {log.status}
              </span>
              <span className="text-[#F8FAFC] leading-tight">{log.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
