import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchPFZ } from '../services/api';
import { Anchor, Compass, Navigation, Fish, Waves, Thermometer, ShieldAlert, CheckCircle, Volume2 } from 'lucide-react';

export default function FishingZonePage() {
  const { t, userProfile } = useLanguage();
  const [pfzData, setPfzData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchPFZ(userProfile.port || 'mumbai').then((data) => {
      if (isMounted) {
        setPfzData(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [userProfile.port]);

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
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold">Fetching INCOIS Satellite Ocean PFZ Advisories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl">
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{t('pfz_title')}</h2>
            <p className="text-xs text-slate-400">{t('pfz_subtitle')}</p>
          </div>
        </div>

        <button
          onClick={() => speakText(`INCOIS Fishing zone advisory for ${userProfile.port}. ${pfzData?.zones?.length} zones active.`)}
          className="p-3 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 rounded-xl border border-cyan-500/30"
          title="Listen Audio Advisory"
        >
          <Volume2 className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Agency Info Badge */}
      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-300 flex items-center justify-between">
        <span className="font-bold text-cyan-400">Source: {pfzData?.agency}</span>
        <span className="text-[11px] text-slate-400">Valid: {pfzData?.valid_until}</span>
      </div>

      {/* Active Fishing Zones */}
      <div className="space-y-4">
        {pfzData?.zones?.map((zone) => (
          <div key={zone.zone_id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            {/* Zone Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-950 text-cyan-300 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {zone.zone_id}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{zone.sector}</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">{zone.location_name}</h3>
                <p className="text-xs text-slate-400">Landing Centre: <span className="text-slate-200 font-semibold">{zone.landing_centre}</span></p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">{t('catch_likelihood')}</span>
                <span className="text-lg font-black text-emerald-400">{zone.catch_likelihood}</span>
              </div>
            </div>

            {/* GPS & Navigation Coordinates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('distance')}</span>
                <span className="text-sm font-extrabold text-white">{zone.distance_nm} NM</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('bearing')}</span>
                <span className="text-sm font-extrabold text-cyan-400">{zone.bearing_direction}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">GPS Latitude</span>
                <span className="text-xs font-mono font-bold text-slate-200">{zone.latitude}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">GPS Longitude</span>
                <span className="text-xs font-mono font-bold text-slate-200">{zone.longitude}</span>
              </div>
            </div>

            {/* Oceanography Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                <Thermometer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-400 block">Sea Temp (SST)</span>
                <span className="text-sm font-black text-white">{zone.sea_surface_temp_c}°C</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                <Waves className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-400 block">Depth</span>
                <span className="text-sm font-black text-white">{zone.depth_meters} m</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                <Fish className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-400 block">Chlorophyll</span>
                <span className="text-sm font-black text-white">{zone.chlorophyll_mg_m3} mg/m³</span>
              </div>
            </div>

            {/* Expected Species */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-100 flex items-center gap-2">
              <Fish className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span><strong>{t('species')}:</strong> {zone.expected_species}</span>
            </div>

            {/* Zone Safety Note */}
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              zone.safety_rating === 'red'
                ? 'bg-red-950/60 border-red-500/50 text-red-200'
                : zone.safety_rating === 'yellow'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
            }`}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{zone.safety_note}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
