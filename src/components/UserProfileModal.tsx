import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { UserProfile } from '../types';
import {
  User,
  X,
  CheckCircle2,
  ShieldCheck,
  Building,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  isRegistered: boolean;
  onToggleRegistration: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  isRegistered,
  onToggleRegistration,
}) => {
  const { textSize, highContrast } = useAccessibility();

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-modal-title"
    >
      <div
        className={`w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border-2 overflow-hidden animate-in zoom-in-95 duration-200 ${
          highContrast
            ? 'bg-black border-orange-500 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl ${
                highContrast
                  ? 'bg-orange-500 text-white'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
              }`}
            >
              <User className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="user-profile-modal-title" className={`${titleClass} font-black leading-tight`}>
                Perfil de Usuario
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                    isRegistered
                      ? highContrast
                        ? 'bg-emerald-400 text-black'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : highContrast
                      ? 'bg-neutral-800 text-neutral-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {isRegistered ? 'Cuenta Registrada y Verificada' : 'Modo Invitado'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de perfil"
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 ${
              highContrast
                ? 'text-orange-400 hover:bg-neutral-900 focus:ring-orange-400'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:ring-slate-400'
            }`}
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* User Card Content */}
        <div className="py-5 space-y-4">
          <div
            className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
              highContrast
                ? 'bg-neutral-950 border-neutral-800 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Titular
                </span>
                <span className="text-base sm:text-lg font-black">{user.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  DNI / Identidad
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-indigo-700 dark:text-orange-400">
                  {user.dni}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">CUIL:</span>
                <span className="font-mono font-bold">{user.cuil}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">Teléfono / WhatsApp:</span>
                <span className="font-bold">{user.phone}</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-semibold block">Domicilio Registrado:</span>
                <span className="font-bold">{user.address}</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-semibold block">Correo Electrónico:</span>
                <span className="font-bold">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Biometrics & Mi Argentina Integration Badge */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
              highContrast
                ? 'bg-neutral-900 border-orange-500/40 text-orange-200'
                : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-orange-400 shrink-0" aria-hidden="true" />
            <span>Datos validados con Renaper y Mi Argentina Nivel 3.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onToggleRegistration}
            className={`w-full sm:w-auto text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
              highContrast
                ? 'border-neutral-700 text-neutral-300 hover:border-orange-500 hover:text-orange-300'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {isRegistered ? 'Simular modo invitado' : 'Simular usuario registrado'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              highContrast
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
