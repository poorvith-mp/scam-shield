import React from 'react';
import { ShieldAlert, Sun, Moon, Globe } from 'lucide-react';

export function Header({ language, setLanguage, theme, toggleTheme, t }) {
  return (
    <header className="w-full border-b border-forest-700/60 dark:border-forest-700/60 bg-forest-900/80 dark:bg-forest-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-100 dark:text-slate-100 tracking-tight">
                {t.app_title}
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.system_status}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 hidden sm:block">
              {t.app_tagline}
            </p>
          </div>
        </div>

        {/* Controls: Language & Theme */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
              className="pl-8 pr-3 py-1.5 text-xs font-medium bg-forest-800 dark:bg-forest-800 border border-forest-700 dark:border-forest-700 text-slate-200 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.theme_toggle_dark : t.theme_toggle_light}
            className="w-8 h-8 rounded-lg bg-forest-800 dark:bg-forest-800 border border-forest-700 dark:border-forest-700 flex items-center justify-center text-slate-300 dark:text-slate-300 hover:text-emerald-400 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
