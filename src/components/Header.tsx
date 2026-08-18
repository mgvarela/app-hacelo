import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Volume2, VolumeX, Type, Eye, Check } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    audioFeedback,
    setAudioFeedback,
    isSpeaking,
    stopSpeaking,
  } = useAccessibility();

  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('xlarge');
    else setTextSize('normal');
  };

  const textSizeLabel = textSize === 'normal' ? 'A Normal' : textSize === 'large' ? 'A+ Grande' : 'A++ Gigante';

  return (
    <header
      id="app-main-header"
      className={`w-full transition-colors duration-200 border-b ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-white/95 backdrop-blur-md text-slate-900 border-slate-200/90'
      } px-4 sm:px-6 md:px-8 py-3.5 sticky top-0 z-30 shadow-xs`}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Status */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black ring-2 ring-yellow-400'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              }`}
            >
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  HACÉLO<span className={highContrast ? 'text-yellow-400' : 'text-indigo-600'}>.</span>
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    highContrast
                      ? 'bg-yellow-400 text-black font-extrabold'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Accesible
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm font-medium ${
                  highContrast ? 'text-yellow-200' : 'text-slate-600'
                }`}
              >
                Trámites fáciles hablando o tocando un botón
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Quick Controls (WCAG AA & AAA compliant) */}
        <nav
          aria-label="Herramientas de accesibilidad"
          className="flex items-center justify-center sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto flex-wrap"
        >
          {/* Audio read aloud toggle */}
          <button
            type="button"
            id="btn-toggle-audio-feedback"
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setAudioFeedback(!audioFeedback);
            }}
            aria-label={audioFeedback ? 'Voz de lectura activada. Tocar para desactivar' : 'Voz de lectura desactivada. Tocar para activar'}
            title="Lectura en voz alta"
            className={`min-h-[44px] min-w-[44px] flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-3 ${
              audioFeedback
                ? highContrast
                  ? 'bg-yellow-400 text-black ring-2 ring-yellow-400 focus:ring-yellow-400'
                  : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-500'
                : highContrast
                ? 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-neutral-500 focus:ring-yellow-400'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 focus:ring-slate-400'
            }`}
          >
            {audioFeedback ? (
              <Volume2 className="w-4 h-4 text-current" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-current" aria-hidden="true" />
            )}
            <span>{audioFeedback ? 'Voz activa' : 'Silencio'}</span>
          </button>

          {/* Text Size Switcher */}
          <button
            type="button"
            id="btn-cycle-text-size"
            onClick={cycleTextSize}
            aria-label={`Tamaño de letra actual: ${textSizeLabel}. Tocar para cambiar`}
            title="Aumentar tamaño de letra"
            className={`min-h-[44px] min-w-[44px] flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm focus:outline-none focus:ring-3 ${
              highContrast
                ? 'bg-neutral-900 text-yellow-300 border border-yellow-400 hover:bg-neutral-800 focus:ring-yellow-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400'
            }`}
          >
            <Type className="w-4 h-4" aria-hidden="true" />
            <span className="font-semibold">{textSizeLabel}</span>
          </button>

          {/* WCAG High Contrast Mode Toggle */}
          <button
            type="button"
            id="btn-toggle-high-contrast"
            onClick={() => setHighContrast(!highContrast)}
            aria-pressed={highContrast}
            aria-label={highContrast ? 'Modo alto contraste activado. Tocar para modo estándar' : 'Modo alto contraste desactivado. Tocar para activar contraste WCAG'}
            title="Modo alto contraste WCAG AAA"
            className={`min-h-[44px] min-w-[44px] flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none focus:ring-3 ${
              highContrast
                ? 'bg-yellow-400 text-black ring-2 ring-yellow-400 focus:ring-yellow-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400'
            }`}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>{highContrast ? 'Contraste Alto' : 'Contraste'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
