import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProcessDefinition } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';

interface HumanGateModalProps {
  procedure: ProcessDefinition;
  customMessage?: string;
  selectedOptionData?: any;
  onApproveAndExecute: () => void;
  onCancel: () => void;
  isExecuting: boolean;
}

export const HumanGateModal: React.FC<HumanGateModalProps> = ({
  procedure,
  customMessage,
  selectedOptionData,
  onApproveAndExecute,
  onCancel,
  isExecuting,
}) => {
  const { textSize, highContrast } = useAccessibility();

  const titleClass =
    textSize === 'xlarge'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : textSize === 'large'
      ? 'text-lg sm:text-xl md:text-2xl'
      : 'text-base sm:text-lg md:text-xl';
  const bodyClass =
    textSize === 'xlarge' ? 'text-base sm:text-lg' : textSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="human-gate-title"
    >
      <div
        className={`w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border-2 relative overflow-hidden animate-in zoom-in-95 duration-200 ${
          highContrast
            ? 'bg-black border-yellow-400 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Accent Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${
              highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-indigo-50 border border-indigo-100 text-indigo-700'
            }`}
          >
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />
          </div>
          <div>
            <span
              className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-100 text-indigo-900'
              }`}
            >
              Paso de Seguridad
            </span>
            <h3 id="human-gate-title" className={`${titleClass} font-black leading-tight mt-1`}>
              ¿Confirmás que querés enviar el trámite?
            </h3>
          </div>
        </div>

        {/* Message and details */}
        <div
          className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 space-y-3 my-4 sm:my-5 ${
            highContrast
              ? 'bg-neutral-900 border-yellow-400 text-yellow-100'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <p className={`${bodyClass} font-bold leading-relaxed`}>
            {customMessage || procedure.humanGateMessage}
          </p>

          {selectedOptionData && (
            <div
              className={`p-3.5 sm:p-4 rounded-xl border text-sm space-y-1 ${
                highContrast
                  ? 'bg-black border-yellow-400 text-white'
                  : 'bg-white border-indigo-100 text-slate-900 shadow-2xs'
              }`}
            >
              <span
                className={`text-xs font-black uppercase tracking-wider block ${
                  highContrast ? 'text-yellow-400' : 'text-slate-500'
                }`}
              >
                Opción elegida:
              </span>
              <div className="font-extrabold text-base text-indigo-700 dark:text-yellow-300">
                {selectedOptionData.label}
              </div>
              {selectedOptionData.location && (
                <div className="text-xs text-slate-600 dark:text-neutral-300 font-medium">
                  {selectedOptionData.location}
                </div>
              )}
            </div>
          )}

          <div
            className={`flex items-center gap-2 text-xs font-black pt-1 ${
              highContrast ? 'text-yellow-300' : 'text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>Tus datos están protegidos y verificados con el organismo oficial</span>
          </div>
        </div>

        {/* Actions (WCAG Touch targets) */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isExecuting}
            className={`min-h-[48px] px-5 py-3.5 rounded-xl sm:rounded-2xl text-sm font-bold transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 ${
              highContrast
                ? 'text-neutral-200 hover:text-white focus:ring-yellow-400'
                : 'text-slate-600 hover:text-slate-900 focus:ring-slate-400'
            }`}
          >
            Volver a revisar
          </button>

          <button
            type="button"
            id="btn-confirm-and-complete-human-gate"
            onClick={onApproveAndExecute}
            disabled={isExecuting}
            className={`min-h-[48px] flex-1 font-black text-sm sm:text-base py-4 px-6 rounded-xl sm:rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 focus:outline-none focus:ring-3 ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 focus:ring-emerald-500'
            }`}
          >
            {isExecuting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Completando trámite...</span>
              </>
            ) : (
              <>
                <span>SÍ, ENVIAR TRÁMITE</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
