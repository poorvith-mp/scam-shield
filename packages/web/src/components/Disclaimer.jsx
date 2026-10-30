import React from 'react';
import { Info } from 'lucide-react';

export function Disclaimer({ t }) {
  return (
    <footer className="mt-8 p-4 rounded-xl bg-forest-900/60 border border-forest-700/50 text-slate-400 text-xs leading-relaxed max-w-4xl mx-auto">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          {t.disclaimer}
        </p>
      </div>
    </footer>
  );
}
