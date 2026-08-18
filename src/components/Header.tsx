import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { UserProfile } from '../types';
import {
  Volume2,
  VolumeX,
  Type,
  Eye,
  History,
  UserCheck,
  User,
} from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  isRegistered: boolean;
  user: UserProfile;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenProfile,
  isRegistered,
  user,
  historyCount,
}) => {
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

  const textSizeLabel =
    textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++';

  return (
    <header
      id="app-main-header"
      className={`w-full transition-colors duration-200 border-b ${
        highContrast
          ? 'bg-black text-white border-orange-500'
          : 'bg-white/95 backdrop-blur-md text-slate-900 border-slate-200/90'
      } px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 sticky top-0 z-30 shadow-xs`}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl transition-all shrink-0 ${
              highContrast
                ? 'bg-orange-500 text-white ring-2 ring-orange-500'
                : 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
            }`}
          >
            H
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none">
                HACÉLO<span className={highContrast ? 'text-orange-500' : 'text-indigo-600'}>.</span>
              </h1>
              <span
                className={`hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${
                  highContrast
                    ? 'bg-orange-500 text-white font-black'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Accesible
              </span>
            </div>
            <p
              className={`hidden sm:block text-xs font-medium ${
                highContrast ? 'text-orange-200' : 'text-slate-500'
              } mt-0.5`}
            >
              Trámites fáciles hablando o tocando
            </p>
          </div>
        </div>

        {/* Right: Streamlined 1-Row Compact Bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* User Registration Status */}
          <button
            type="button"
            id="btn-user-registration-header"
            onClick={onOpenProfile}
            aria-label={isRegistered ? `Usuario registrado: ${user.name}` : 'Registrarse'}
            title="Datos de Registro"
            className={`min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
              isRegistered
                ? highContrast
                  ? 'bg-orange-500 text-white ring-2 ring-orange-500 focus:ring-orange-400'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 focus:ring-emerald-500'
                : highContrast
                ? 'bg-neutral-900 text-neutral-300 border border-neutral-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            {isRegistered ? (
              <UserCheck className="w-4 h-4 text-emerald-700 dark:text-white shrink-0" aria-hidden="true" />
            ) : (
              <User className="w-4 h-4 text-current shrink-0" aria-hidden="true" />
            )}
            <span className="hidden md:inline font-black">
              {isRegistered ? 'Registrado: María E.' : 'Registrarse'}
            </span>
            <span className="inline md:hidden text-xs font-black">María</span>
          </button>

          {/* History Button */}
          <button
            type="button"
            id="btn-open-history-header"
            onClick={onOpenHistory}
            aria-label="Ver historial de trámites"
            title="Historial de trámites"
            className={`min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
              highContrast
                ? 'bg-neutral-900 text-orange-400 border border-orange-500 hover:bg-neutral-800 focus:ring-orange-400'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 focus:ring-indigo-500'
            }`}
          >
            <History className="w-4 h-4 text-current shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline font-black">Historial</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                highContrast ? 'bg-orange-500 text-white' : 'bg-indigo-200 text-indigo-900'
              }`}
            >
              {historyCount}
            </span>
          </button>

          {/* Unified Accessibility Mini-Bar (Segmented Clean Controls) */}
          <div
            className={`flex items-center p-0.5 sm:p-1 rounded-xl border ${
              highContrast
                ? 'bg-neutral-950 border-orange-500/60 text-white'
                : 'bg-slate-100/90 border-slate-200/90 text-slate-700'
            }`}
          >
            {/* Audio Toggle */}
            <button
              type="button"
              id="btn-toggle-audio-feedback"
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setAudioFeedback(!audioFeedback);
              }}
              aria-label={audioFeedback ? 'Voz activa' : 'Silencio'}
              title={audioFeedback ? 'Voz activada (Tocar para silenciar)' : 'Silencio (Tocar para activar voz)'}
              className={`min-h-[36px] min-w-[36px] p-2 rounded-lg flex items-center justify-center transition-all ${
                audioFeedback
                  ? highContrast
                    ? 'bg-orange-500 text-white font-black shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : highContrast
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {audioFeedback ? (
                <Volume2 className="w-4 h-4 text-current" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-current" aria-hidden="true" />
              )}
            </button>

            {/* Text Size Cycle */}
            <button
              type="button"
              id="btn-cycle-text-size"
              onClick={cycleTextSize}
              aria-label={`Tamaño de letra actual: ${textSizeLabel}. Tocar para cambiar`}
              title={`Tamaño de letra: ${textSizeLabel} (Tocar para cambiar)`}
              className={`min-h-[36px] min-w-[36px] px-2 py-1 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-0.5 transition-all ${
                textSize !== 'normal'
                  ? highContrast
                    ? 'bg-neutral-800 text-orange-400 border border-orange-500/40'
                    : 'bg-white text-indigo-700 shadow-2xs'
                  : highContrast
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="leading-none">{textSizeLabel}</span>
            </button>

            {/* Contrast Mode */}
            <button
              type="button"
              id="btn-toggle-high-contrast"
              onClick={() => setHighContrast(!highContrast)}
              aria-pressed={highContrast}
              aria-label={highContrast ? 'Alto contraste activo' : 'Contraste estándar'}
              title={highContrast ? 'Modo Alto Contraste WCAG AAA (Activo)' : 'Activar Modo Alto Contraste'}
              className={`min-h-[36px] min-w-[36px] p-2 rounded-lg flex items-center justify-center transition-all ${
                highContrast
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-current" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
