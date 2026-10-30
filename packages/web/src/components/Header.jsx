import React from 'react';
import { ShieldAlert, Sun, Moon, Globe } from 'lucide-react';

export function Header({ language, setLanguage, theme, toggleTheme, t }) {
  return (
    <header className="w-full border-b border-forest-700/60 bg-forest-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight whitespace-nowrap">
                {t.app_title}
              </h1>
              <span className="hidden md:inline-flex text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {t.system_status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
              {t.app_tagline}
            </p>
          </div>
        </div>

        {/* Controls: Language & Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
              className="pl-7 pr-2 sm:pr-3 py-1 text-xs font-medium bg-forest-800 border border-forest-700 text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.theme_toggle_dark : t.theme_toggle_light}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-forest-800 border border-forest-700 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
