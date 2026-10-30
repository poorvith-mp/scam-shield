import React, { useState } from 'react';
import { MessageSquare, PhoneCall, CreditCard, Sparkles, Trash2, ArrowRight, Loader2 } from 'lucide-react';

const SAMPLES = {
  sms: [
    {
      key: 'safe_otp',
      text: 'Your OTP is 492019 for txn of Rs 1,200 at Amazon. Do NOT share your OTP with anyone. Bank officials never ask for OTP or password.'
    },
    {
      key: 'digital_arrest',
      text: 'This is CBI Police headquarters. A parcel in your name contains illegal narcotics. You are under digital arrest. Transfer Rs 50,000 fine immediately to avoid detention.'
    },
    {
      key: 'job_scam',
      text: 'Part time job offer! Like 5 YouTube videos daily and earn Rs 3,500 every day. Contact our Telegram manager @TaskMaster and pay Rs 500 registration fee.'
    }
  ],
  payment: [
    {
      key: 'qr_scam',
      text: 'Congratulations! You won cashback of Rs 10,000. Scan this QR code and enter your UPI PIN to claim credit into your bank account now.'
    },
    {
      key: 'bank_kyc',
      text: 'Dear customer, your SBI bank account is suspended due to pending KYC. Send Rs 100 verification fee or click http://sbi-kyc-update-portal.xyz within 2 hours.'
    }
  ]
};

export function InputTabs({ onSubmit, isLoading, t }) {
  const [activeTab, setActiveTab] = useState('sms');
  const [smsText, setSmsText] = useState('');
  const [callSignals, setCallSignals] = useState({
    arrest: false,
    money: false,
    otp: false,
    urgency: false,
    authority: false
  });
  const [callNotes, setCallNotes] = useState('');
  const [paymentText, setPaymentText] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSignalToggle = (key) => {
    setCallSignals((prev) => ({ ...prev, [key]: !prev[key] }));
    if (validationError) setValidationError('');
  };

  const handleClear = () => {
    setSmsText('');
    setCallSignals({
      arrest: false,
      money: false,
      otp: false,
      urgency: false,
      authority: false
    });
    setCallNotes('');
    setPaymentText('');
    setValidationError('');
  };

  const getActiveText = () => {
    if (activeTab === 'sms') return smsText;
    if (activeTab === 'payment') return paymentText;
    // Format call mode
    const selectedLabels = Object.entries(callSignals)
      .filter(([_, isChecked]) => isChecked)
      .map(([k, _]) => t.call_signals[k]);

    let formatted = '';
    if (selectedLabels.length > 0) {
      formatted += `[Call Warning Signals: ${selectedLabels.join('; ')}]`;
    }
    if (callNotes.trim()) {
      formatted += (formatted ? ' ' : '') + `Notes: ${callNotes.trim()}`;
    }
    return formatted;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const textToSubmit = getActiveText().trim();

    if (!textToSubmit) {
      setValidationError(t.errors.empty);
      return;
    }

    if (textToSubmit.length > 5000) {
      setValidationError(t.errors.too_long);
      return;
    }

    onSubmit({
      message: textToSubmit,
      source: 'web'
    });
  };

  const currentCharCount = getActiveText().length;

  return (
    <div className="w-full bg-forest-900 border border-forest-700 rounded-2xl p-5 shadow-lg">
      {/* Tabs Header */}
      <div className="flex border-b border-forest-700/80 mb-4 pb-2 gap-2" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'sms'}
          onClick={() => { setActiveTab('sms'); setValidationError(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'sms'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-forest-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.tabs.sms}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'call'}
          onClick={() => { setActiveTab('call'); setValidationError(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'call'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-forest-800'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t.tabs.call}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'payment'}
          onClick={() => { setActiveTab('payment'); setValidationError(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'payment'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-forest-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t.tabs.payment}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: SMS / Text Message */}
        {activeTab === 'sms' && (
          <div className="space-y-3">
            <label htmlFor="sms-input" className="block text-xs font-medium text-slate-300">
              {t.sms_helper}
            </label>
            <textarea
              id="sms-input"
              rows={5}
              value={smsText}
              onChange={(e) => { setSmsText(e.target.value); if (validationError) setValidationError(''); }}
              placeholder={t.sms_placeholder}
              maxLength={5000}
              className="w-full bg-forest-950 border border-forest-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
            />
          </div>
        )}

        {/* Tab 2: Call Checkboxes & Notes */}
        {activeTab === 'call' && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-300">{t.call_instruction}</p>
            <div className="space-y-2.5 bg-forest-950 p-4 rounded-xl border border-forest-700/70">
              {Object.keys(callSignals).map((signalKey) => (
                <label
                  key={signalKey}
                  className="flex items-start gap-3 cursor-pointer group select-none text-left"
                >
                  <input
                    type="checkbox"
                    checked={callSignals[signalKey]}
                    onChange={() => handleSignalToggle(signalKey)}
                    className="mt-1 w-4 h-4 rounded border-forest-700 bg-forest-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors leading-relaxed">
                    {t.call_signals[signalKey]}
                  </span>
                </label>
              ))}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="call-notes" className="block text-xs font-medium text-slate-400">
                {t.call_notes_placeholder}
              </label>
              <textarea
                id="call-notes"
                rows={3}
                value={callNotes}
                onChange={(e) => { setCallNotes(e.target.value); if (validationError) setValidationError(''); }}
                placeholder="e.g. Caller claimed to be Inspector Kumar from Mumbai Crime Branch..."
                maxLength={4000}
                className="w-full bg-forest-950 border border-forest-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Payment Request */}
        {activeTab === 'payment' && (
          <div className="space-y-3">
            <label htmlFor="payment-input" className="block text-xs font-medium text-slate-300">
              {t.payment_helper}
            </label>
            <textarea
              id="payment-input"
              rows={5}
              value={paymentText}
              onChange={(e) => { setPaymentText(e.target.value); if (validationError) setValidationError(''); }}
              placeholder={t.payment_placeholder}
              maxLength={5000}
              className="w-full bg-forest-950 border border-forest-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
            />
          </div>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400" role="alert">
            {validationError}
          </div>
        )}

        {/* Samples for SMS and Payment */}
        {activeTab !== 'call' && (
          <div className="mt-4 pt-3 border-t border-forest-700/40">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.samples_label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLES[activeTab]?.map((sample) => (
                <button
                  key={sample.key}
                  type="button"
                  onClick={() => {
                    if (activeTab === 'sms') setSmsText(sample.text);
                    if (activeTab === 'payment') setPaymentText(sample.text);
                    setValidationError('');
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-forest-800 text-slate-300 border border-forest-700 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                >
                  {t.samples[sample.key]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls & Character Counter */}
        <div className="mt-5 flex items-center justify-between border-t border-forest-700/60 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading || currentCharCount === 0}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clear_btn}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              {currentCharCount} / 5,000 {t.char_count}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-forest-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-forest-950" />
                <span>{t.analyzing_btn}</span>
              </>
            ) : (
              <>
                <span>{t.analyze_btn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
