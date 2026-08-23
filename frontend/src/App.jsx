import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import OnboardingModal from './components/OnboardingModal';
import SMSAlertSimulator from './components/SMSAlertSimulator';
import DashboardPage from './pages/DashboardPage';
import CropDiseasePage from './pages/CropDiseasePage';
import FishingZonePage from './pages/FishingZonePage';
import MarketPricesPage from './pages/MarketPricesPage';
import SchemeAssistantPage from './pages/SchemeAssistantPage';
import { Home, Leaf, Anchor, Store, Bot } from 'lucide-react';

function MainApp() {
  const { t, userProfile } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSmsOpen, setIsSmsOpen] = useState(false);

  useEffect(() => {
    // Open onboarding automatically on initial visit if not onboarded yet
    if (!userProfile.onboarded) {
      setIsOnboardingOpen(true);
    }
  }, [userProfile.onboarded]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSmsModal={() => setIsSmsOpen(true)}
      />

      {/* Main View Container */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'home' && <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'disease' && <CropDiseasePage />}
        {activeTab === 'pfz' && <FishingZonePage />}
        {activeTab === 'market' && <MarketPricesPage />}
        {activeTab === 'schemes' && <SchemeAssistantPage />}
      </main>

      {/* Onboarding Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Feature Phone SMS Simulator Modal */}
      <SMSAlertSimulator
        isOpen={isSmsOpen}
        onClose={() => setIsSmsOpen(false)}
        weatherData={{ wave_height_meters: 3.4, condition: 'Storm advisory' }}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-around py-2 px-2">
          
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl text-[11px] font-black transition transform active:scale-95 min-h-[50px] ${
              activeTab === 'home' 
                ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 shadow-lg shadow-emerald-950/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('nav_home')}</span>
          </button>

          <button
            onClick={() => setActiveTab('disease')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl text-[11px] font-black transition transform active:scale-95 min-h-[50px] ${
              activeTab === 'disease' 
                ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 shadow-lg shadow-emerald-950/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Leaf className="w-5 h-5" />
            <span>{t('nav_crop_disease')}</span>
          </button>

          <button
            onClick={() => setActiveTab('pfz')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl text-[11px] font-black transition transform active:scale-95 min-h-[50px] ${
              activeTab === 'pfz' 
                ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 shadow-lg shadow-cyan-950/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Anchor className="w-5 h-5" />
            <span>{t('nav_fishing_zone')}</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl text-[11px] font-black transition transform active:scale-95 min-h-[50px] ${
              activeTab === 'market' 
                ? 'text-amber-400 bg-amber-950/80 border border-amber-500/30 shadow-lg shadow-amber-950/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>{t('nav_market')}</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl text-[11px] font-black transition transform active:scale-95 min-h-[50px] ${
              activeTab === 'schemes' 
                ? 'text-indigo-400 bg-indigo-950/80 border border-indigo-500/30 shadow-lg shadow-indigo-950/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span>{t('nav_schemes')}</span>
          </button>

        </div>
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
