import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  History,
  X,
  CheckCircle2,
  Clock,
  Car,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  FileText,
  Building2,
  Ban,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProcedure: (procedureKey: string, promptText: string) => void;
  historyItems: HistoryItem[];
  onCancelAppointment: (itemId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectProcedure,
  historyItems,
  onCancelAppointment,
}) => {
  const { textSize, highContrast } = useAccessibility();
  const [cancellingItemId, setCancellingItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  const titleClass =
    textSize === 'xlarge'
      ? 'text-xl sm:text-2xl'
      : textSize === 'large'
      ? 'text-lg sm:text-xl'
      : 'text-base sm:text-lg';

  const bodyClass =
    textSize === 'xlarge'
      ? 'text-base'
      : textSize === 'large'
      ? 'text-sm'
      : 'text-xs sm:text-sm';

  const renderIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <Car className="w-5 h-5" aria-hidden="true" />;
      case 'lightbulb':
        return <Lightbulb className="w-5 h-5" aria-hidden="true" />;
      case 'shield':
        return <ShieldAlert className="w-5 h-5" aria-hidden="true" />;
      default:
        return <FileText className="w-5 h-5" aria-hidden="true" />;
    }
  };

  const handleConfirmCancel = (id: string) => {
    onCancelAppointment(id);
    setCancellingItemId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border-2 overflow-hidden animate-in zoom-in-95 duration-200 ${
          highContrast
            ? 'bg-black border-orange-500 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold ${
                highContrast
                  ? 'bg-orange-500 text-white'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
              }`}
            >
              <History className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="history-modal-title" className={`${titleClass} font-black leading-tight`}>
                Historial de Trámites
              </h2>
              <p
                className={`text-xs ${
                  highContrast ? 'text-orange-200' : 'text-slate-500'
                } font-medium`}
              >
                Turnos agendados, gestiones en curso y trámites resueltos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar historial"
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 ${
              highContrast
                ? 'text-orange-400 hover:bg-neutral-900 focus:ring-orange-400'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:ring-slate-400'
            }`}
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* List of Procedures */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {historyItems.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const isCancelled = item.status === 'CANCELLED';
            const hasAppointment = item.hasAppointment && !isCancelled;
            const isConfirmingThis = cancellingItemId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all space-y-2.5 ${
                  highContrast
                    ? 'bg-neutral-950 border-neutral-800 hover:border-orange-500'
                    : isCancelled
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                }`}
              >
                {/* Top info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        highContrast
                          ? 'bg-neutral-900 text-orange-400 border border-orange-500/50'
                          : isCancelled
                          ? 'bg-slate-200 text-slate-500'
                          : 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                      }`}
                    >
                      {renderIcon(item.iconType)}
                    </div>
                    <span className="font-extrabold text-sm sm:text-base leading-tight">
                      {item.procedureTitle}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto ${
                      isCancelled
                        ? highContrast
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-red-100 text-red-800'
                        : isCompleted
                        ? highContrast
                          ? 'bg-emerald-400 text-black'
                          : 'bg-emerald-100 text-emerald-800'
                        : highContrast
                        ? 'bg-orange-500 text-white'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isCancelled ? (
                      <>
                        <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>TURNO CANCELADO</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>FINALIZADO</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>EN PROCESO</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Sub details */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-slate-500 dark:text-neutral-400">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-neutral-300">
                    <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {item.jurisdiction}
                  </span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-indigo-700 dark:text-orange-400">
                    {item.referenceCode}
                  </span>
                </div>

                <p
                  className={`${bodyClass} font-medium ${
                    highContrast ? 'text-neutral-300' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>

                {/* Inline Confirmation when user clicks "Cancelar Turno" */}
                {isConfirmingThis ? (
                  <div
                    className={`p-3.5 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150 ${
                      highContrast
                        ? 'bg-neutral-900 border-red-500 text-white'
                        : 'bg-red-50 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
                      <span className="text-xs sm:text-sm font-bold">
                        ¿Seguro que deseás cancelar este turno?
                      </span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setCancellingItemId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-300"
                      >
                        No cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmCancel(item.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-xs"
                      >
                        Confirmar Cancelación
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Action buttons: Retake or Cancel Appointment */
                  <div className="pt-1.5 flex flex-wrap items-center justify-end gap-2.5">
                    {hasAppointment && (
                      <button
                        type="button"
                        onClick={() => setCancellingItemId(item.id)}
                        aria-label={`Cancelar turno de ${item.procedureTitle}`}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                          highContrast
                            ? 'border-red-500 text-red-400 hover:bg-red-950 hover:text-white'
                            : 'border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 hover:border-red-300'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Cancelar Turno</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onSelectProcedure(item.procedureKey, item.procedureTitle);
                        onClose();
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 ${
                        highContrast
                          ? 'bg-neutral-900 text-orange-400 border border-orange-500 hover:bg-neutral-800 focus:ring-orange-400'
                          : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 shadow-2xs focus:ring-indigo-500'
                      }`}
                    >
                      <span>{isCancelled ? 'Reagendar Trámite' : 'Ver o Retomar'}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 ${
              highContrast
                ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400'
                : 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
