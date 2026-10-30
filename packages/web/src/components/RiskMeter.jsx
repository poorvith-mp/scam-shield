import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export function RiskMeter({ score, verdict, t }) {
  // Determine color and icons based on score
  let bandColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';
  let borderColor = 'border-emerald-500/30';
  let bgColor = 'bg-emerald-500/10';
  let bandLabel = t.risk_bands.safe;
  let IconComponent = ShieldCheck;

  if (score > 65 || verdict === 'danger') {
    bandColor = 'bg-rose-500';
    textColor = 'text-rose-400';
    borderColor = 'border-rose-500/30';
    bgColor = 'bg-rose-500/10';
    bandLabel = t.risk_bands.danger;
    IconComponent = AlertOctagon;
  } else if (score > 30 || verdict === 'suspicious') {
    bandColor = 'bg-amber-500';
    textColor = 'text-amber-400';
    borderColor = 'border-amber-500/30';
    bgColor = 'bg-amber-500/10';
    bandLabel = t.risk_bands.suspicious;
    IconComponent = AlertTriangle;
  }

  return (
    <div className={`p-4 rounded-xl border ${borderColor} ${bgColor} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconComponent className={`w-5 h-5 ${textColor}`} />
          <span className="text-xs uppercase font-mono tracking-wider text-slate-300">
            {t.risk_score_label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold font-mono ${textColor}`}>{score}</span>
          <span className="text-xs text-slate-400 font-mono">/ 100</span>
        </div>
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-3 bg-forest-950/80 rounded-full overflow-hidden p-0.5 border border-forest-700/50"
        role="meter"
        aria-valuenow={score}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${t.risk_score_label}: ${score}% - ${bandLabel}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${bandColor}`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>

      {/* Threshold Bands Indicator */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          0-30 Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          31-65 Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
          66-100 High
        </span>
      </div>

      <div className="mt-2 pt-2 border-t border-forest-700/30 flex items-center justify-between">
        <span className="text-xs text-slate-300">Band:</span>
        <span className={`text-xs font-semibold ${textColor}`}>{bandLabel}</span>
      </div>
    </div>
  );
}
