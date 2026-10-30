import React from 'react';
import { RiskMeter } from './RiskMeter';
import { ShieldAlert, AlertCircle, CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react';

export function ResultCard({ result, onReset, t }) {
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const {
    verdict,
    verdict_emoji,
    risk_score,
    scam_type,
    red_flags = [],
    explanation,
    safe_action,
    display
  } = result;

  const handleCopyAdvice = () => {
    const textToCopy = [
      `Scam Shield Verdict: ${verdict.toUpperCase()} (Risk Score: ${risk_score}/100)`,
      `Scam Type: ${scam_type}`,
      `Safe Action: ${safe_action}`,
      `Explanation: ${explanation}`
    ].join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictBadgeStyle = () => {
    if (verdict === 'danger') {
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
    if (verdict === 'suspicious') {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const scamTypeLabel = t.scam_types[scam_type] || scam_type;

  return (
    <div className="w-full bg-forest-900 border border-forest-700 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header: Verdict and Type */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-700/60 pb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
            {t.result_title}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">{verdict_emoji}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getVerdictBadgeStyle()}`}>
              {verdict}
            </span>
            <span className="text-xs font-mono text-slate-300 px-2 py-0.5 rounded bg-forest-800 border border-forest-700">
              {scamTypeLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAdvice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-800 border border-forest-700 hover:border-forest-600 text-xs text-slate-300 hover:text-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Advice'}</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-forest-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.check_another_btn}</span>
          </button>
        </div>
      </div>

      {/* Risk Meter Visual Component */}
      <RiskMeter score={risk_score} verdict={verdict} t={t} />

      {/* Safe Action Callout */}
      <div className="p-4 rounded-xl bg-forest-950 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <h3 className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
            {t.section_safe_action}
          </h3>
        </div>
        <p className="text-sm text-slate-200 font-medium leading-relaxed">
          {safe_action}
        </p>
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400">
          {t.section_explanation}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed bg-forest-950/60 p-4 rounded-xl border border-forest-700/60">
          {explanation}
        </p>
      </div>

      {/* Warning Flags */}
      {red_flags && red_flags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs uppercase font-mono tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t.section_flags} ({red_flags.length})</span>
          </h3>
          <ul className="space-y-2">
            {red_flags.map((flag, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-300 flex items-start gap-2 bg-forest-950/40 p-3 rounded-lg border border-forest-700/40"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Checklist / Bullets if provided */}
      {display?.bullets && display.bullets.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-forest-700/40">
          <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400">
            {t.section_checklist}
          </h3>
          <ul className="space-y-1.5">
            {display.bullets.map((bullet, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
