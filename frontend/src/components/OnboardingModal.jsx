import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Anchor, MapPin, CheckCircle, X } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose }) {
  const { language, setLanguage, t, userProfile, updateProfile } = useLanguage();
  
  const [role, setRole] = useState(userProfile.role || 'farmer');
  const [district, setDistrict] = useState(userProfile.district || 'Nashik');
  const [crop, setCrop] = useState(userProfile.primaryCrop || 'Tomato');
  const [boat, setBoat] = useState(userProfile.boatType || 'Motorized Craft (30ft)');
  const [port, setPort] = useState(userProfile.port || 'Mumbai Sassoon Dock');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      role,
      district,
      primaryCrop: crop,
      boatType: boat,
      port
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center mb-3 shadow-lg">
            <Sprout className="w-7 h-7 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{t('onboarding_title')}</h2>
          <p className="text-xs text-slate-400 mt-1">{t('onboarding_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. {t('select_language')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'mr', label: 'मराठी (Marathi)' },
                { code: 'en', label: 'English' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                    language === lang.code
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Persona Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. {t('select_role')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Farmer Option */}
              <div
                onClick={() => setRole('farmer')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  role === 'farmer'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Sprout className="w-7 h-7 text-emerald-400" />
                  {role === 'farmer' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                </div>
                <h3 className="font-bold text-sm text-white">{t('role_farmer')}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{t('farmer_desc')}</p>
              </div>

              {/* Fisherman Option */}
              <div
                onClick={() => setRole('fisherman')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  role === 'fisherman'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Anchor className="w-7 h-7 text-cyan-400" />
                  {role === 'fisherman' && <CheckCircle className="w-5 h-5 text-cyan-400" />}
                </div>
                <h3 className="font-bold text-sm text-white">{t('role_fisherman')}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{t('fisherman_desc')}</p>
              </div>

            </div>
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              3. {t('district_label')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Nashik">Nashik (Maharashtra)</option>
                <option value="Ratnagiri">Ratnagiri Coast (Maharashtra)</option>
                <option value="Mumbai">Mumbai Coastal Zone (Maharashtra)</option>
                <option value="Pune">Pune Rural (Maharashtra)</option>
                <option value="Latur">Latur (Maharashtra)</option>
                <option value="Nagpur">Nagpur (Maharashtra)</option>
              </select>
            </div>
          </div>

          {/* Conditional Specs */}
          {role === 'farmer' ? (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                4. {t('crop_label')}
              </label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Tomato, Onion, Wheat"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  4. {t('boat_label')}
                </label>
                <input
                  type="text"
                  value={boat}
                  onChange={(e) => setBoat(e.target.value)}
                  placeholder="e.g. Motorized Craft"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  5. {t('port_label')}
                </label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="e.g. Sassoon Dock"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition transform active:scale-95"
          >
            {t('save_profile')}
          </button>

        </form>
      </div>
    </div>
  );
}
