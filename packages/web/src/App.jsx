import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputTabs } from './components/InputTabs';
import { ResultCard } from './components/ResultCard';
import { Disclaimer } from './components/Disclaimer';
import { translations } from './i18n/translations';
import { analyzeMessageApi } from './services/api';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('scam_shield_lang') || 'en';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scam_shield_theme') || 'dark';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState(null);

  // Sync theme to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('scam_shield_theme', theme);
  }, [theme]);

  // Sync language to storage
  useEffect(() => {
    localStorage.setItem('scam_shield_lang', language);
    // If a result is currently displayed, re-analyze to provide pure target language copy
    if (currentResult && lastSubmittedPayload) {
      handleAnalyze(lastSubmittedPayload, language);
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAnalyze = async (payload, targetLang = language) => {
    setIsLoading(true);
    setApiError(null);
    setLastSubmittedPayload(payload);

    const res = await analyzeMessageApi({
      message: payload.message,
      language: targetLang,
      source: payload.source || 'web'
    });

    setIsLoading(false);

    if (!res.success) {
      if (res.status === 429) {
        setApiError(translations[targetLang]?.errors.rate_limited || translations.en.errors.rate_limited);
      } else if (res.status === 0 || res.status === 408) {
        setApiError(translations[targetLang]?.errors.network || translations.en.errors.network);
      } else {
        setApiError(res.error || translations[targetLang]?.errors.server || translations.en.errors.server);
      }
      return;
    }

    setCurrentResult(res.data);
  };

  const handleReset = () => {
    setCurrentResult(null);
    setApiError(null);
    setLastSubmittedPayload(null);
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-forest-950 text-slate-100 transition-colors">
      <Header
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        t={t}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Intro banner */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            {t.app_title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {t.app_tagline}
          </p>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400" role="alert">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold">Verification Notice</p>
              <p>{apiError}</p>
            </div>
          </div>
        )}

        {/* Input Form or Result View */}
        {!currentResult ? (
          <InputTabs
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            t={t}
          />
        ) : (
          <ResultCard
            result={currentResult}
            onReset={handleReset}
            t={t}
          />
        )}

        <Disclaimer t={t} />
      </main>
    </div>
  );
}
