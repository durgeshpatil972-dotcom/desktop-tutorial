import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, Volume2 } from 'lucide-react';

export default function SafetyBanner({ level = 'green', title, message, onSpeak }) {
  const styles = {
    red: {
      bg: 'bg-red-950/80 border-red-500 text-red-100',
      badgeBg: 'bg-red-600 text-white',
      icon: <AlertOctagon className="w-8 h-8 text-red-400 animate-bounce" />,
      tag: 'CRITICAL ALERT'
    },
    yellow: {
      bg: 'bg-amber-950/80 border-amber-500 text-amber-100',
      badgeBg: 'bg-amber-500 text-slate-950',
      icon: <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />,
      tag: 'CAUTION ADVISORY'
    },
    green: {
      bg: 'bg-emerald-950/80 border-emerald-500 text-emerald-100',
      badgeBg: 'bg-emerald-600 text-white',
      icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
      tag: 'NORMAL CONDITIONS'
    }
  };

  const current = styles[level] || styles.green;

  return (
    <div className={`p-4 rounded-2xl border-2 shadow-xl backdrop-blur-md mb-6 ${current.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0">{current.icon}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${current.badgeBg}`}>
                {current.tag}
              </span>
            </div>
            <h3 className="font-extrabold text-base text-white leading-snug">{title}</h3>
            <p className="text-xs mt-1 text-slate-200 leading-relaxed">{message}</p>
          </div>
        </div>

        {onSpeak && (
          <button
            onClick={() => onSpeak(`${title}. ${message}`)}
            className="p-2.5 bg-slate-900/60 hover:bg-slate-800 rounded-xl text-cyan-300 border border-slate-700 flex-shrink-0 transition"
            title="Listen to Voice Advisory"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
