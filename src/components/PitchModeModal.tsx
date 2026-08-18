import React, { useState } from 'react';
import { Trophy, Clock, X, CheckCircle2, Bot, Zap, ArrowRight, Play, ShieldAlert, Cpu, Award } from 'lucide-react';

interface PitchModeModalProps {
  onClose: () => void;
  onRunDemoCase: (caseId: string) => void;
}

export const PitchModeModal: React.FC<PitchModeModalProps> = ({
  onClose,
  onRunDemoCase,
}) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'criteria' | 'roadmap'>('pitch');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-100">
            <Trophy className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              CoderCup AI T1 • Presentación & Jurado
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              HACÉLO — Pitch Deck & Demo Guionada
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'pitch'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Estructura Demo (2 min)
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'criteria'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Evaluación Jurado (9.1/10)
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'roadmap'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Plan 11 Días (23 Agosto)
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {activeTab === 'pitch' && (
            <div className="space-y-3.5">
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                  Tagline & Mensaje Central (30 seg)
                </span>
                <p className="text-sm font-extrabold text-slate-900 leading-snug">
                  “Las personas no deberían tener que aprender cómo funciona cada sistema digital para poder hacer algo. Vos decís qué necesitás. HACÉLO se ocupa del cómo.”
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                    0:00 – 0:20
                  </span>
                  <div>
                    <strong className="text-slate-900">El Problema Real:</strong>
                    <p className="text-slate-600 mt-0.5">
                      La fricción digital y la sobrecarga cognitiva en trámites públicos y privados. El 60% abandona por no saber qué documento falta o qué paso sigue.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                    0:20 – 0:40
                  </span>
                  <div>
                    <strong className="text-slate-900">Presentación de HACÉLO:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Capa inteligente entre el ciudadano y los sistemas. No es un chatbot de texto; es un motor de ejecución con matriz de requisitos vivos.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                    0:40 – 1:30
                  </span>
                  <div className="flex-1">
                    <strong className="text-indigo-950">Demo Funcional en Vivo:</strong>
                    <p className="text-slate-700 mt-0.5 mb-2">
                      El usuario dice: <em>"Quiero renovar mi registro en San Martín"</em>. En 30 segundos se diagnostican requisitos, se resuelve el turno médico con 1 toque y se confirma.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onRunDemoCase('licencia_conducir');
                          onClose();
                        }}
                        className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-indigo-700"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Ejecutar Demo 1: Licencia</span>
                      </button>
                      <button
                        onClick={() => {
                          onRunDemoCase('subsidio_luz');
                          onClose();
                        }}
                        className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-slate-900"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Ejecutar Demo 2: Subsidio Luz</span>
                      </button>
                      <button
                        onClick={() => {
                          onRunDemoCase('escudo_antifraude');
                          onClose();
                        }}
                        className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-red-700"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Ejecutar Demo 3: Escudo Anti-Estafas</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                    1:30 – 1:50
                  </span>
                  <div>
                    <strong className="text-slate-900">Magia Técnica (IA + n8n):</strong>
                    <p className="text-slate-600 mt-0.5">
                      Mostramos la orquestación en segundo plano: Gemini infiere el grafo de estados, y n8n dispara los webhooks simulados devolviendo el código oficial y sincronizando Calendar.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                    1:50 – 2:00
                  </span>
                  <div>
                    <strong className="text-emerald-950">Impacto & Cierre:</strong>
                    <p className="text-emerald-800 mt-0.5">
                      Trámites reducidos de 45 minutos a 90 segundos. Accesible, universal y escalable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'criteria' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Puntaje Global Jurado</div>
                  <div className="text-2xl font-black text-emerald-400">9.1 / 10</div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  Top Tier / Podio CoderCup
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Problema & Dolor</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">9.5 / 10</div>
                  <p className="text-[11px] text-slate-500">Universal y aplicable a cualquier ciudadano.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Diferencial vs Chatbot</span>
                  <div className="text-base font-extrabold text-indigo-600 mt-0.5">9.2 / 10</div>
                  <p className="text-[11px] text-slate-500">Task Agent con UI generativa interactiva.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Uso de IA & n8n</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">9.0 / 10</div>
                  <p className="text-[11px] text-slate-500">Entity extraction + Structured Graph.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Accesibilidad & UX</span>
                  <div className="text-base font-extrabold text-emerald-600 mt-0.5">9.5 / 10</div>
                  <p className="text-[11px] text-slate-500">Zero-slop, botones grandes, soporte de voz.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">Día 1-3: Core IA & Graph Engine</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">COMPLETADO</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">Día 4-6: UI Accesible & Matrix de Requisitos</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">COMPLETADO</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">Día 7-8: Webhooks n8n & Comprobantes Digitales</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">COMPLETADO</span>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-indigo-900">Día 9-10: Grabación Video Demo (2 min)</span>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">EN PROGRESO</span>
              </div>
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <span className="font-bold">Día 11 (23 de Agosto): Entrega CoderCup AI T1</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">DEADLINE</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs"
          >
            Cerrar & Volver a la App
          </button>
        </div>
      </div>
    </div>
  );
};
