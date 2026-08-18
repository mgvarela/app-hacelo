import React, { useState } from 'react';
import { ProcessRequirement } from '../types';
import { Check, MapPin, ArrowRight } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface ActionSlotPickerProps {
  requirement: ProcessRequirement;
  onConfirmSelection: (selectedId: string, optionData: any) => void;
  onCancel: () => void;
}

export const ActionSlotPicker: React.FC<ActionSlotPickerProps> = ({
  requirement,
  onConfirmSelection,
  onCancel,
}) => {
  const { textSize, highContrast, audioFeedback, speak } = useAccessibility();
  const payload = requirement.actionPayload;
  const options = payload?.options || [];
  const [selectedId, setSelectedId] = useState<string>(payload?.defaultSelected || options[0]?.id || '');

  const handleSelect = (id: string, opt: any) => {
    setSelectedId(id);
    if (audioFeedback) {
      speak(`${opt.label}. ${opt.sublabel || ''}`);
    }
  };

  const handleContinue = () => {
    const chosen = options.find((o) => o.id === selectedId) || options[0];
    onConfirmSelection(selectedId, chosen);
  };

  const titleClass =
    textSize === 'xlarge' ? 'text-lg sm:text-xl' : textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';
  const bodyClass =
    textSize === 'xlarge' ? 'text-base' : textSize === 'large' ? 'text-sm' : 'text-xs sm:text-sm';

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        highContrast
          ? 'bg-neutral-900 border-orange-500 text-white'
          : 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/50'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <span
            className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block ${
              highContrast ? 'bg-orange-500 text-white' : 'bg-indigo-50 text-indigo-800'
            }`}
          >
            Elección Sencilla en 1 Toque
          </span>
          <h3 className={`${titleClass} font-black text-slate-900 ${highContrast ? 'text-white' : ''} mt-1`}>
            {payload?.fieldLabel || 'Seleccioná la opción que te quede más cómoda:'}
          </h3>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Opciones disponibles"
        className="space-y-2.5 sm:space-y-3 max-h-[320px] overflow-y-auto pr-1"
      >
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option.id, option);
                }
              }}
              onClick={() => handleSelect(option.id, option)}
              className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all focus:outline-none focus:ring-3 ${
                isSelected
                  ? highContrast
                    ? 'border-orange-500 bg-neutral-800 text-white ring-2 ring-orange-500/40 focus:ring-orange-400'
                    : 'border-indigo-600 bg-indigo-50/80 shadow-sm focus:ring-indigo-500'
                  : highContrast
                  ? 'border-neutral-700 bg-neutral-950 hover:border-neutral-500 focus:ring-orange-400'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:ring-indigo-500'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`${titleClass} font-black`}>{option.label}</span>
                  </div>
                  {option.sublabel && (
                    <p
                      className={`${bodyClass} ${
                        highContrast ? 'text-neutral-200' : 'text-slate-600'
                      } leading-snug`}
                    >
                      {option.sublabel}
                    </p>
                  )}
                  {option.location && (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold pt-1 ${
                        highContrast ? 'text-orange-400' : 'text-indigo-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{option.location}</span>
                    </div>
                  )}
                </div>
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? highContrast
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-indigo-600 bg-indigo-600 text-white'
                      : highContrast
                      ? 'border-neutral-500 bg-neutral-900'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className={`min-h-[44px] text-sm font-bold px-4 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 ${
            highContrast
              ? 'text-neutral-300 hover:text-white focus:ring-orange-400'
              : 'text-slate-600 hover:text-slate-900 focus:ring-slate-400'
          }`}
        >
          Volver
        </button>
        <button
          type="button"
          onClick={handleContinue}
          id="btn-confirm-slot-selection"
          className={`min-h-[48px] font-black text-sm sm:text-base py-3.5 px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md focus:outline-none focus:ring-3 ${
            highContrast
              ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 focus:ring-indigo-500'
          }`}
        >
          <span>Elegir esta opción</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
