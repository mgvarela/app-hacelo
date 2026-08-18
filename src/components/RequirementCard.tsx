import React from 'react';
import { ProcessRequirement } from '../types';
import { Check, Lock, AlertCircle, ChevronRight, ArrowUpRight } from 'lucide-react';

interface RequirementCardProps {
  requirement: ProcessRequirement;
  onActionClick?: () => void;
  isActive?: boolean;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  onActionClick,
  isActive = false,
}) => {
  const { name, description, status, statusLabel, requiredAction } = requirement;

  if (status === 'VALIDATED') {
    return (
      <div className="flex items-center justify-between bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">{name}</div>
            <div className="text-[11px] text-slate-500 leading-tight">{description}</div>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-emerald-100/90 text-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border border-emerald-200/60">
          {statusLabel || 'VALIDADO'}
        </span>
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div
        className={`bg-white p-3.5 rounded-xl border-2 ${
          isActive ? 'border-indigo-600 shadow-md shadow-indigo-100' : 'border-indigo-300'
        } transition-all relative overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
              <span className="text-[11px] font-bold">!</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{name}</div>
              <div className="text-[11px] text-slate-600 leading-tight mt-0.5">{description}</div>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-full uppercase font-bold tracking-wider shrink-0 animate-pulse">
            {statusLabel || 'ACCIONAR'}
          </span>
        </div>

        {requiredAction && onActionClick && (
          <button
            onClick={onActionClick}
            id={`btn-resolve-${requirement.id}`}
            className="w-full mt-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2 px-3 rounded-lg border border-indigo-200 flex items-center justify-between transition-all active:scale-[0.99]"
          >
            <span>{requiredAction}</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
          </button>
        )}
      </div>
    );
  }

  // LOCKED
  return (
    <div className="flex items-center justify-between bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/50 opacity-60">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
          <Lock className="w-3 h-3" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-600">{name}</div>
          <div className="text-[11px] text-slate-400 leading-tight">{description}</div>
        </div>
      </div>
      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-semibold tracking-wide shrink-0">
        {statusLabel || 'BLOQUEADO'}
      </span>
    </div>
  );
};
