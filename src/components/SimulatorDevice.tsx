import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  ArrowRight,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Car,
  Lightbulb,
  ShieldAlert,
  MapPin,
  Check,
  Building2,
  CalendarDays,
  FileCheck,
} from 'lucide-react';
import {
  ProcessDefinition,
  ProcessStatus,
  AutomationExecutionResult,
  ProcessRequirement,
} from '../types';
import { ActionSlotPicker } from './ActionSlotPicker';
import { HumanGateModal } from './HumanGateModal';
import { SuccessReceipt } from './SuccessReceipt';
import { useAccessibility } from '../context/AccessibilityContext';

interface SimulatorDeviceProps {
  currentPrompt: string;
  onPromptChange: (val: string) => void;
  onSubmitPrompt: (promptToUse?: string) => void;
  activeProcedure: ProcessDefinition;
  processStatus: ProcessStatus;
  userExplanation: string;
  isProcessing: boolean;
  onExecuteAutomation: (selectedOption?: any) => void;
  onReset: () => void;
  executionResult: AutomationExecutionResult | null;
}

const QUICK_DEMO_PROMPTS = [
  {
    id: 'licencia',
    icon: Car,
    title: 'Renovar Licencia de Conducir',
    subtitle: 'Registro B1 / Municipal',
    prompt: 'Quiero renovar mi licencia de conducir en San Martín',
  },
  {
    id: 'luz',
    icon: Lightbulb,
    title: 'Pedir Subsidio de Luz',
    subtitle: 'Segmentación Energética RASE',
    prompt: 'Me vino el triple de luz y no puedo pagarlo, ¿cómo pido subsidio?',
  },
  {
    id: 'estafa',
    icon: ShieldAlert,
    title: 'Revisar Mensaje Sospechoso',
    subtitle: 'Escudo Anti-Fraude Digital',
    prompt: 'Me llegó un SMS diciendo que tengo un paquete retenido y que pague urgente.',
  },
];

export const SimulatorDevice: React.FC<SimulatorDeviceProps> = ({
  currentPrompt,
  onPromptChange,
  onSubmitPrompt,
  activeProcedure,
  processStatus,
  userExplanation,
  isProcessing,
  onExecuteAutomation,
  onReset,
  executionResult,
}) => {
  const { textSize, highContrast, audioFeedback, speak } = useAccessibility();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isHumanGateOpen, setIsHumanGateOpen] = useState<boolean>(false);
  const [isActionSlotOpen, setIsActionSlotOpen] = useState<boolean>(false);
  const [selectedSlotData, setSelectedSlotData] = useState<any>(null);
  const [listeningTranscript, setListeningTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Read aloud explanation on new procedure or plan ready
  useEffect(() => {
    if (audioFeedback && processStatus === 'PLAN_READY' && userExplanation) {
      speak(`${activeProcedure.title}. ${userExplanation}.`);
    }
  }, [activeProcedure.id, processStatus]);

  // Read aloud on completed
  useEffect(() => {
    if (audioFeedback && processStatus === 'COMPLETED' && executionResult) {
      speak(`Excelente. Trámite completado con éxito. Tu código es ${executionResult.referenceCode}.`);
    }
  }, [processStatus, executionResult]);

  // Speech recognition setup with continuous transcript feedback
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallbackMsg = 'Tu navegador no soporta dictado directo. Por favor escribí tu consulta.';
      if (audioFeedback) speak(fallbackMsg);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-AR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setListeningTranscript('');
        if (audioFeedback) speak('Te escucho, decime qué trámite necesitás.');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const text = finalTranscript || interimTranscript;
        setListeningTranscript(text);
        if (finalTranscript) {
          onPromptChange(finalTranscript);
          setIsListening(false);
          onSubmitPrompt(finalTranscript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const pendingRequirement = activeProcedure.requirements.find((r) => r.status === 'PENDING');

  const handleConfirmSlotSelection = (selectedId: string, optionData: any) => {
    setSelectedSlotData(optionData);
    setIsActionSlotOpen(false);
    if (audioFeedback) {
      speak(`Seleccionaste ${optionData.label}. Ahora confirmamos el trámite.`);
    }
    setIsHumanGateOpen(true);
  };

  // Typography Scales based on accessibility level
  const titleClass =
    textSize === 'xlarge'
      ? 'text-2xl sm:text-3xl md:text-4xl'
      : textSize === 'large'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : 'text-lg sm:text-xl md:text-2xl';

  const bodyClass =
    textSize === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textSize === 'large'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  const subTextClass =
    textSize === 'xlarge' ? 'text-base' : textSize === 'large' ? 'text-sm' : 'text-xs';

  return (
    <section aria-label="Asistente de Trámites" className="w-full max-w-4xl mx-auto">
      {/* 2026 Minimalist Responsive Card Container */}
      <div
        className={`w-full rounded-2xl sm:rounded-3xl transition-all duration-200 ${
          highContrast
            ? 'bg-black text-white border-2 border-yellow-400 shadow-none'
            : 'bg-white text-slate-900 border border-slate-200/90 shadow-lg sm:shadow-xl shadow-slate-200/50'
        } overflow-hidden p-4 sm:p-7 md:p-10`}
      >
        {/* Completed View */}
        {processStatus === 'COMPLETED' && executionResult ? (
          <SuccessReceipt
            result={executionResult}
            procedure={activeProcedure}
            onReset={onReset}
          />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Top Prompting / Voice Command Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h2 className={`${titleClass} font-black tracking-tight leading-snug`}>
                    Hola, ¿qué trámite querés resolver hoy?
                  </h2>
                  <p
                    className={`${subTextClass} ${
                      highContrast ? 'text-yellow-200' : 'text-slate-600'
                    } font-medium mt-1`}
                  >
                    Podés hablar con el micrófono, escribir abajo o tocar un trámite frecuente.
                  </p>
                </div>
                {audioFeedback && (
                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        `Hola, ¿qué trámite querés resolver hoy? Podés tocar el botón grande de micrófono para hablarme.`
                      )
                    }
                    className={`min-h-[44px] min-w-[44px] p-3 rounded-xl sm:rounded-2xl shrink-0 transition-colors flex items-center justify-center focus:outline-none focus:ring-3 ${
                      highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-500'
                    }`}
                    title="Escuchar instrucción"
                    aria-label="Escuchar instrucción en voz alta"
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Big 2026 Voice + Text Bar (Designed for Touch, Voice & Screen Readers) */}
              <div className="space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentPrompt.trim() && !isProcessing) {
                      onSubmitPrompt();
                    }
                  }}
                  className="relative flex items-center"
                >
                  <label htmlFor="input-user-intent-main" className="sr-only">
                    Escribí el trámite que querés realizar
                  </label>
                  <input
                    type="text"
                    id="input-user-intent-main"
                    value={currentPrompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="Ej: Renovar registro, pedir subsidio de luz..."
                    className={`w-full py-4 sm:py-5 pl-4 sm:pl-5 pr-28 sm:pr-32 rounded-xl sm:rounded-2xl font-medium outline-none transition-all ${bodyClass} min-h-[52px] ${
                      highContrast
                        ? 'bg-neutral-900 border-2 border-yellow-400 text-yellow-300 placeholder:text-neutral-400 focus:ring-3 focus:ring-yellow-400'
                        : 'bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-500 shadow-xs focus:ring-3 focus:ring-indigo-100'
                    }`}
                  />

                  {/* Micro & Send Buttons (WCAG 44px min touch target) */}
                  <div className="absolute right-2 sm:right-2.5 flex items-center gap-1.5 sm:gap-2">
                    {/* Giant Accessible Mic Button */}
                    <button
                      type="button"
                      id="btn-main-mic-accessible"
                      onClick={toggleVoiceInput}
                      aria-label={isListening ? 'Detener dictado por voz' : 'Hablar por micrófono'}
                      title={isListening ? 'Escuchando... Tocar para pausar' : 'Tocar para hablar'}
                      className={`min-h-[44px] min-w-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-3 ${
                        isListening
                          ? 'bg-red-600 text-white animate-pulse shadow-lg focus:ring-red-400'
                          : highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300 font-bold focus:ring-yellow-400'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 focus:ring-indigo-500'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                      ) : (
                        <Mic className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                      )}
                    </button>

                    {/* Send Button */}
                    <button
                      type="submit"
                      id="btn-main-submit"
                      disabled={!currentPrompt.trim() || isProcessing}
                      aria-label="Buscar trámite"
                      className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all disabled:opacity-40 focus:outline-none focus:ring-3 ${
                        highContrast
                          ? 'bg-neutral-800 text-yellow-400 border border-yellow-400 hover:bg-neutral-700 focus:ring-yellow-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900'
                      }`}
                    >
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </form>

                {/* Voice Feedback Banner */}
                {isListening && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 animate-pulse border ${
                      highContrast
                        ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
                    <div className="flex-1">
                      <p className="font-bold text-sm sm:text-base">Te estoy escuchando... Hablá con tranquilidad</p>
                      {listeningTranscript && (
                        <p className="text-xs sm:text-sm font-mono mt-0.5 font-semibold">"{listeningTranscript}"</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Accessible 1-Tap Quick Action Buttons (Simple Line Icons - Responsive Grid) */}
              <div className="pt-2">
                <span
                  className={`block text-xs font-extrabold uppercase tracking-wider mb-2.5 ${
                    highContrast ? 'text-yellow-400' : 'text-slate-600'
                  }`}
                >
                  Trámites frecuentes:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                  {QUICK_DEMO_PROMPTS.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onPromptChange(item.prompt);
                          onSubmitPrompt(item.prompt);
                        }}
                        className={`min-h-[56px] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left font-bold transition-all border flex items-center gap-3 focus:outline-none focus:ring-3 active:scale-98 ${
                          highContrast
                            ? 'bg-neutral-900 hover:bg-neutral-800 border-yellow-400 text-yellow-300 focus:ring-yellow-400'
                            : 'bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border-slate-200 text-slate-800 hover:text-indigo-950 shadow-2xs focus:ring-indigo-500'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            highContrast
                              ? 'bg-black text-yellow-400 border border-yellow-400'
                              : 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-black leading-tight truncate">
                            {item.title}
                          </div>
                          <div
                            className={`text-[11px] font-medium truncate mt-0.5 ${
                              highContrast ? 'text-neutral-300' : 'text-slate-500'
                            }`}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* In Progress / Active Plan Section */}
            {isProcessing ? (
              <div
                role="status"
                aria-live="polite"
                className={`p-8 sm:p-10 rounded-2xl sm:rounded-3xl text-center space-y-3 sm:space-y-4 border ${
                  highContrast ? 'bg-neutral-900 border-yellow-400' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className={`${titleClass} font-bold`}>Buscando la información oficial...</h3>
                <p className={`${subTextClass} ${highContrast ? 'text-neutral-300' : 'text-slate-600'}`}>
                  Revisando requisitos en organismos públicos y preparando tus opciones.
                </p>
              </div>
            ) : (
              <div className="space-y-6 pt-4 border-t border-slate-200/80">
                {/* Detected Procedure Summary Card */}
                <div
                  className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all ${
                    highContrast
                      ? 'bg-neutral-900 border-yellow-400 text-white'
                      : 'bg-indigo-50/50 border-indigo-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 ${
                            highContrast
                              ? 'bg-yellow-400 text-black'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{activeProcedure.jurisdiction}</span>
                        </span>
                      </div>
                      <h3 className={`${titleClass} font-black mt-2 leading-tight`}>
                        {activeProcedure.title}
                      </h3>
                      <p
                        className={`${bodyClass} ${
                          highContrast ? 'text-yellow-100' : 'text-slate-700'
                        } font-medium mt-1`}
                      >
                        {userExplanation || activeProcedure.summary}
                      </p>
                    </div>

                    {audioFeedback && (
                      <button
                        type="button"
                        onClick={() =>
                          speak(`${activeProcedure.title}. ${userExplanation || activeProcedure.summary}`)
                        }
                        className={`min-h-[44px] min-w-[44px] p-3 rounded-xl sm:rounded-2xl shrink-0 flex items-center justify-center focus:outline-none focus:ring-3 ${
                          highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                            : 'bg-white text-indigo-700 shadow-sm hover:bg-slate-50 focus:ring-indigo-500'
                        }`}
                        title="Leer resumen del trámite"
                        aria-label="Leer resumen del trámite en voz alta"
                      >
                        <Volume2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Clear Step-by-Step Requirements List */}
                <div className="space-y-3">
                  <h4
                    className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${
                      highContrast ? 'text-yellow-400' : 'text-slate-600'
                    }`}
                  >
                    Paso a paso de tu trámite:
                  </h4>

                  <div className="space-y-2.5 sm:space-y-3">
                    {activeProcedure.requirements.map((req, index) => {
                      const isValidated = req.status === 'VALIDATED';
                      const isPending = req.status === 'PENDING';

                      return (
                        <div
                          key={req.id}
                          className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isValidated
                              ? highContrast
                                ? 'bg-neutral-900 border-emerald-400 text-white'
                                : 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                              : isPending
                              ? highContrast
                                ? 'bg-neutral-900 border-yellow-400 text-yellow-300 ring-2 ring-yellow-400/20'
                                : 'bg-white border-indigo-600 shadow-md shadow-indigo-100 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold shrink-0 mt-0.5 sm:mt-0 ${
                                isValidated
                                  ? 'bg-emerald-600 text-white'
                                  : isPending
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isValidated ? (
                                <Check className="w-5 h-5 stroke-[3]" aria-hidden="true" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <div className={`${bodyClass} font-bold leading-tight`}>{req.name}</div>
                              <div
                                className={`${subTextClass} ${
                                  highContrast ? 'text-yellow-200' : 'text-slate-600'
                                } mt-0.5`}
                              >
                                {req.description}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end sm:shrink-0 pt-1 sm:pt-0">
                            {isValidated && (
                              <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-900 rounded-full font-black text-xs inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>LISTO</span>
                              </span>
                            )}

                            {isPending && req.requiredAction && (
                              <button
                                type="button"
                                onClick={() => setIsActionSlotOpen(true)}
                                className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-3 ${
                                  highContrast
                                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-indigo-100'
                                }`}
                              >
                                <span>{req.requiredAction}</span>
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                              </button>
                            )}

                            {!isValidated && !isPending && (
                              <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-semibold text-xs">
                                En espera
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assisted Selection Inline Component */}
                {isActionSlotOpen && pendingRequirement && (
                  <ActionSlotPicker
                    requirement={pendingRequirement}
                    onConfirmSelection={handleConfirmSlotSelection}
                    onCancel={() => setIsActionSlotOpen(false)}
                  />
                )}

                {/* Big Action Button to Complete (WCAG Accessible) */}
                {!isActionSlotOpen && (
                  <div className="pt-2 sm:pt-4">
                    {pendingRequirement ? (
                      <button
                        type="button"
                        onClick={() => setIsActionSlotOpen(true)}
                        className={`w-full min-h-[56px] py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl font-black ${titleClass} flex items-center justify-center gap-3 transition-all active:scale-98 shadow-xl focus:outline-none focus:ring-3 ${
                          highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 focus:ring-indigo-500'
                        }`}
                      >
                        <span>{pendingRequirement.requiredAction || 'Resolver Paso Pendiente'}</span>
                        <ArrowRight className="w-6 h-6" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsHumanGateOpen(true)}
                        className={`w-full min-h-[56px] py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl font-black ${titleClass} flex items-center justify-center gap-3 transition-all active:scale-98 shadow-xl focus:outline-none focus:ring-3 ${
                          highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 focus:ring-emerald-500'
                        }`}
                      >
                        <span>Confirmar y Finalizar Trámite</span>
                        <ArrowRight className="w-6 h-6" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Human Gate Modal */}
      {isHumanGateOpen && (
        <HumanGateModal
          procedure={activeProcedure}
          selectedOptionData={selectedSlotData}
          onApproveAndExecute={() => {
            setIsHumanGateOpen(false);
            onExecuteAutomation(selectedSlotData);
          }}
          onCancel={() => setIsHumanGateOpen(false)}
          isExecuting={processStatus === 'EXECUTING_AUTOMATION'}
        />
      )}
    </section>
  );
};
