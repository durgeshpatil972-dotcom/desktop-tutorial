import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Anchor, Sprout, Globe, WifiOff, Settings, AlertTriangle } from 'lucide-react';

export default function Header({ onOpenOnboarding, onOpenSmsModal }) {
  const { language, setLanguage, t, userProfile, isOffline } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md text-white shadow-xl border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        
        {/* Brand & Persona Badge */}
        <div 
          onClick={onOpenOnboarding}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition"
          title="Click to change Persona or Region"
        >
          <div className={`p-2.5 rounded-2xl shadow-lg flex items-center justify-center transition transform group-hover:scale-105 ${
            userProfile.role === 'fisherman' 
              ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-900/30' 
              : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-900/30'
          }`}>
            {userProfile.role === 'fisherman' ? <Anchor className="w-6 h-6 animate-pulse" /> : <Sprout className="w-6 h-6 animate-bounce" />}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {t('app_name')}
            </h1>
            <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-2 h-2 rounded-full ${userProfile.role === 'fisherman' ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span>{userProfile.role === 'fisherman' ? t('role_fisherman') : t('role_farmer')}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{userProfile.district}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* SMS Alert Simulation Trigger */}
          <button
            onClick={onOpenSmsModal}
            title={t('sms_sim_title')}
            className="p-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border border-amber-500/40 transition active:scale-95 min-h-[42px]"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="hidden sm:inline">SMS Alert</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80 min-h-[42px]">
            <Globe className="w-4 h-4 text-cyan-400 ml-2 mr-1 flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-xs font-black py-1.5 pr-2 pl-1 rounded focus:outline-none cursor-pointer"
            >
              <option value="hi" className="bg-slate-900 text-white">हिंदी (HI)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (MR)</option>
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
            </select>
          </div>

          {/* Settings / Onboarding Modal Trigger */}
          <button
            onClick={onOpenOnboarding}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition active:scale-95 min-h-[42px] min-w-[42px] flex items-center justify-center"
            title="Change Settings / Persona"
          >
            <Settings className="w-5 h-5 text-slate-300" />
          </button>

        </div>
      </div>

      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-amber-950 text-xs font-black py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>{t('nav_offline')} — Offline caching active</span>
        </div>
      )}
    </header>
  );
}
