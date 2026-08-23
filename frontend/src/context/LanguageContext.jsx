import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

const translations = { en, hi, mr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kisansagar_lang') || 'hi';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('kisansagar_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      role: 'farmer', // 'farmer' or 'fisherman'
      district: 'Nashik',
      state: 'Maharashtra',
      primaryCrop: 'Tomato',
      boatType: 'Motorized Craft (30ft)',
      port: 'Mumbai Sassoon Dock',
      onboarded: true
    };
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    localStorage.setItem('kisansagar_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('kisansagar_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = (key) => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  const updateProfile = (newProfile) => {
    setUserProfile((prev) => ({ ...prev, ...newProfile, onboarded: true }));
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      userProfile,
      setUserProfile,
      updateProfile,
      isOffline
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
