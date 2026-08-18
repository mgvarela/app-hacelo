import React from 'react';
import { AgentTelemetryEvent, ExtractedEntities } from '../types';
import { Terminal, Cpu, ArrowRight, Zap, CheckCircle2, Bot, Layers } from 'lucide-react';

interface TelemetryPanelProps {
  telemetryLogs: AgentTelemetryEvent[];
  extractedEntities: ExtractedEntities;
  isProcessing: boolean;
  activeProcedureId: string;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  telemetryLogs,
  extractedEntities,
  isProcessing,
  activeProcedureId,
}) => {
  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-1">
      {/* Strategy Section */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            Estrategia MVP & Veredicto
          </span>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
            CoderCup AI T1
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed text-xs">
          <strong className="text-slate-900">Veredicto Jurado:</strong> Potencial de Podio (9.5/10). Resuelve la fricción burocrática real sin sobrecarga cognitiva. <br />
          <strong className="text-slate-900">Diferencial:</strong> No es un chatbot que vomita texto; es un <span className="text-indigo-600 font-semibold">Agente de Ejecución de Tareas</span> conectado a webhooks (n8n/Make).
        </p>
      </section>

      {/* 4 Pillars Grid (Direct from Professional Polish theme) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 transition-all hover:border-slate-300">
          <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center justify-between">
            <span>Input</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          </div>
          <div className="text-xs font-bold text-slate-800">Lenguaje Natural</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Voz / Texto sin tecnicismos</div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 transition-all hover:border-slate-300">
          <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center justify-between">
            <span>Proceso</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          </div>
          <div className="text-xs font-bold text-slate-800">Razonamiento IA</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Gemini 3.7 Flash + Grafo</div>
        </div>

        <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 transition-all hover:border-indigo-200">
          <div className="text-[10px] font-bold text-indigo-500 mb-1 uppercase tracking-wider flex items-center justify-between">
            <span>Acción</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          </div>
          <div className="text-xs font-bold text-indigo-900">Orquestación n8n</div>
          <div className="text-[11px] text-indigo-700 mt-0.5">Webhooks & Automatización</div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 transition-all hover:border-emerald-200">
          <div className="text-[10px] font-bold text-emerald-500 mb-1 uppercase tracking-wider flex items-center justify-between">
            <span>Resultado</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xs font-bold text-emerald-900">Trámite Completado</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Comprobante & Sincronización</div>
        </div>
      </div>

      {/* Live Agent Terminal Box */}
      <div className="p-5 bg-slate-900 rounded-2xl text-slate-100 shadow-md border border-slate-800 flex flex-col flex-1 min-h-[260px]">
        <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
              Arquitectura del Agente
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-indigo-600/80 text-white rounded text-[10px] font-mono font-semibold">
              Gemini + n8n Engine
            </span>
          </div>
        </div>

        {isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-mono text-indigo-300">Orquestando grafo de ejecución...</p>
            <p className="text-[11px] text-slate-500 mt-1">Extrayendo entidades & evaluando requisitos</p>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs font-mono overflow-y-auto max-h-[220px]">
            {telemetryLogs.map((log, index) => (
              <div
                key={log.id || index}
                className="p-2 bg-slate-800/60 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">[{index + 1}]</span>
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold">{log.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{log.detail}</div>
                    {log.codeSnippet && (
                      <pre className="mt-1.5 p-1.5 bg-black/40 rounded text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                        {log.codeSnippet}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {telemetryLogs.length === 0 && (
              <div className="text-slate-500 text-xs py-4 text-center font-sans">
                Esperando ingreso de intención del usuario...
              </div>
            )}
          </div>
        )}

        {/* Entities Summary Pill */}
        {Object.keys(extractedEntities).length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Layers className="w-3 h-3 text-indigo-400" />
              Entidades:
            </span>
            <span className="text-indigo-300 font-mono font-semibold">
              {Object.entries(extractedEntities)
                .map(([k, v]) => `${k}: "${v}"`)
                .join(' • ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
