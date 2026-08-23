import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Smartphone, Send, X, Check } from 'lucide-react';

export default function SMSAlertSimulator({ isOpen, onClose, weatherData }) {
  const { t, userProfile } = useLanguage();
  const [mobileNum, setMobileNum] = useState('+91 98234 56789');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const alertMessage = userProfile.role === 'fisherman'
    ? `[INCOIS SEVERE WEATHER ALERT] High wave warning (${weatherData?.wave_height_meters || 3.4}m) off ${userProfile.district}. Do NOT venture into sea today. Stay safe.`
    : `[IMD AGRI ADVISORY] ${weatherData?.condition || 'Rainfall expected'} in ${userProfile.district}. Protect harvested crops and delay chemical sprays.`;

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">{t('sms_sim_title')}</h3>
          <p className="text-xs text-slate-400">{t('sms_sim_subtitle')}</p>
        </div>

        {/* Mock Keypad Phone Display */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-3 mb-4 font-mono text-xs text-emerald-400 shadow-inner">
          <div className="flex justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1 mb-2">
            <span>Bhartia Airtel 4G</span>
            <span>10:45 AM</span>
          </div>
          <p className="text-slate-200 leading-relaxed bg-slate-900/80 p-2 rounded border border-slate-800">
            {alertMessage}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Target Phone Number</label>
            <input
              type="text"
              value={mobileNum}
              onChange={(e) => setMobileNum(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sent}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              sent ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {sent ? (
              <>
                <Check className="w-4 h-4" />
                {t('sms_sent_notice')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('send_sms_demo')}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
