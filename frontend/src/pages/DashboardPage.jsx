import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchWeather } from '../services/api';
import SafetyBanner from '../components/SafetyBanner';
import { CloudSun, Wind, Droplets, Waves, Sun, Volume2, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { t, userProfile } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchWeather(userProfile.district, userProfile.role).then((data) => {
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [userProfile.district, userProfile.role]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold">Loading Weather & Safety Advisories...</p>
      </div>
    );
  }

  const isFisherman = userProfile.role === 'fisherman';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
            {t('today_advisory')} • {weather?.location}
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">
            {isFisherman ? `Namaste Fisher Friend` : `Namaste Farmer Friend`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isFisherman ? `Port: ${userProfile.port}` : `Main Crop: ${userProfile.primaryCrop}`}
          </p>
        </div>

        <button
          onClick={() => speakText(`${weather?.safety_title}. ${weather?.safety_message}`)}
          className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-bold transition"
        >
          <Volume2 className="w-5 h-5 text-emerald-400" />
          <span className="hidden sm:inline">Listen Advisory</span>
        </button>
      </div>

      {/* Safety Alert Banner */}
      {weather && (
        <SafetyBanner
          level={weather.safety_level}
          title={weather.safety_title}
          message={weather.safety_message}
          onSpeak={speakText}
        />
      )}

      {/* Grid Cards: Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
          <Sun className="w-7 h-7 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{weather?.temperature}°C</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{t('temp')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
          <Droplets className="w-7 h-7 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{weather?.humidity}%</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{t('humidity')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
          <Wind className="w-7 h-7 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{weather?.wind_speed_kmh} <span className="text-xs text-slate-400">km/h</span></div>
          <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{t('wind_speed')}</div>
        </div>

        {isFisherman ? (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
            <Waves className="w-7 h-7 text-teal-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{weather?.wave_height_meters || 1.8} <span className="text-xs text-slate-400">m</span></div>
            <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{t('wave_height')}</div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
            <CloudSun className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{weather?.rainfall_probability}%</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{t('rain_prob')}</div>
          </div>
        )}

      </div>

      {/* Daily Recommendations List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {t('recommendations_title')}
        </h3>
        <ul className="space-y-2.5">
          {weather?.recommendations?.map((rec, idx) => (
            <li key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed font-medium">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Action Navigation Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-white text-sm">
            {isFisherman ? t('pfz_title') : t('ai_detector_title')}
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            {isFisherman ? `Check satellite Potential Fishing Zones & sea depths` : `Upload leaf photo for instant disease & spray advice`}
          </p>
        </div>
        <button
          onClick={() => onNavigate(isFisherman ? 'pfz' : 'disease')}
          className="p-3 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md hover:bg-emerald-400 transition"
        >
          <span>Open</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
