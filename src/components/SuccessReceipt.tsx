import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, RotateCcw } from 'lucide-react';
import { AutomationExecutionResult, ProcessDefinition } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';

interface SuccessReceiptProps {
  result: AutomationExecutionResult;
  procedure: ProcessDefinition;
  onReset: () => void;
}

export const SuccessReceipt: React.FC<SuccessReceiptProps> = ({
  result,
  procedure,
  onReset,
}) => {
  const { textSize, highContrast } = useAccessibility();

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleDownloadProof = () => {
    const textContent = `
========================================
HACÉLO • COMPROBANTE OFICIAL DE GESTIÓN
========================================
Número de Comprobante: ${result.referenceCode}
Trámite: ${procedure.title}
Organismo Oficial: ${procedure.jurisdiction}
Fecha y Hora: ${new Date().toLocaleString()}
----------------------------------------
DATOS CONFIRMADOS:
${Object.entries(result.details)
  .map(([k, v]) => `• ${k}: ${v}`)
  .join('\n')}
----------------------------------------
ESTADO: COMPLETADO Y REGISTRADO CON ÉXITO
HACÉLO se ocupó del trámite por vos.
========================================
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HACELO-Comprobante-${result.referenceCode.replace('#', '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const titleClass =
    textSize === 'xlarge'
      ? 'text-2xl sm:text-3xl md:text-4xl'
      : textSize === 'large'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : 'text-lg sm:text-xl md:text-2xl';

  const bodyClass =
    textSize === 'xlarge'
      ? 'text-base sm:text-lg'
      : textSize === 'large'
      ? 'text-sm sm:text-base'
      : 'text-xs sm:text-sm';

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border-2 space-y-6 animate-in zoom-in-95 duration-200 ${
        highContrast
          ? 'bg-black border-emerald-400 text-white'
          : 'bg-white border-emerald-200 shadow-xl shadow-emerald-50/50 text-slate-900'
      }`}
    >
      {/* Top Success Badge */}
      <div className="text-center space-y-3">
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
            highContrast ? 'bg-emerald-400 text-black' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
        </div>
        <span
          className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block ${
            highContrast
              ? 'bg-emerald-400 text-black'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
          }`}
        >
          ¡Listo! Trámite Realizado
        </span>
        <h2 className={`${titleClass} font-black leading-tight`}>
          {procedure.finalSuccessTitle}
        </h2>
        <p className={`${bodyClass} text-slate-600 ${highContrast ? 'text-neutral-200' : ''}`}>
          Ya registramos todo ante el organismo oficial. No tenés que hacer nada más.
        </p>
      </div>

      {/* Official Reference Card with Big Legible Digits */}
      <div
        className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 space-y-4 ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Tu Código de Trámite:
          </span>
          <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400 tracking-wider">
            {result.referenceCode}
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {Object.entries(result.details).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-sm py-1.5 border-b border-slate-800 last:border-0"
            >
              <span className="text-slate-300 font-medium">{label}:</span>
              <span className="text-white font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Big Action Buttons (WCAG Responsive Touch Targets) */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <button
          type="button"
          onClick={handleDownloadProof}
          id="btn-download-receipt-proof"
          className={`min-h-[50px] flex-1 py-4 px-6 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all active:scale-98 shadow-md focus:outline-none focus:ring-3 ${
            highContrast
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 focus:ring-indigo-500'
          }`}
        >
          <Download className="w-5 h-5" aria-hidden="true" />
          <span>Guardar / Descargar Comprobante</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          id="btn-new-procedure-reset"
          className={`min-h-[50px] py-4 px-6 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all focus:outline-none focus:ring-2 ${
            highContrast
              ? 'border-yellow-400 hover:bg-neutral-900 text-yellow-300 focus:ring-yellow-400'
              : 'border-slate-300 hover:bg-slate-100 text-slate-800 focus:ring-slate-400'
          }`}
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          <span>Hacer otro trámite</span>
        </button>
      </div>
    </div>
  );
};
