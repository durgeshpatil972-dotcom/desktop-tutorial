import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { askSchemeAI } from '../services/api';
import { Bot, Send, Mic, Volume2, VolumeX, FileText, ExternalLink, Sparkles, User, HelpCircle } from 'lucide-react';

export default function SchemeAssistantPage() {
  const { language, t, userProfile } = useLanguage();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: t('schemes_subtitle'),
      grounded_scheme: 'PM Welfare Schemes',
      documents: ['Aadhaar Card', 'Land Records / Boat License', 'Bank Passbook']
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userText = query) => {
    const textToSend = userText || query;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    const res = await askSchemeAI(textToSend, language, userProfile.role);
    const botMsg = {
      sender: 'bot',
      text: res.answer,
      grounded_scheme: res.grounded_scheme,
      official_portal: res.official_portal,
      documents: res.documents
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);

    // Speak response for accessibility
    speakText(res.answer.replace(/[*•#]/g, ''));
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{t('schemes_title')}</h2>
            <p className="text-xs text-slate-400">Grounded Scheme Knowledge Base (PM-KISAN, PMFBY, KCC, PMMSY)</p>
          </div>
        </div>

        <button
          onClick={stopSpeech}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1"
          title={t('speech_stop')}
        >
          <VolumeX className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Mute Voice</span>
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          {t('suggested_questions')}
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: t('q_pmkisan'), q: 'PM KISAN installment details' },
            { label: t('q_crop_insurance'), q: 'PMFBY crop loss insurance claim process' },
            { label: t('q_fisherman_subsidies'), q: 'PMMSY boat and GPS subsidies for fishermen' },
            { label: t('q_kcc'), q: 'Kisan Credit Card KCC loan application' }
          ].map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip.q)}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Display Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[380px] overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-2 shadow-md ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-tl-none'
            }`}>
              {msg.grounded_scheme && msg.sender === 'bot' && (
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px]">
                  <span className="font-extrabold text-indigo-400 uppercase tracking-wider">{msg.grounded_scheme}</span>
                  <button
                    onClick={() => speakText(msg.text.replace(/[*•#]/g, ''))}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t('speech_speak')}</span>
                  </button>
                </div>
              )}

              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {msg.documents && msg.documents.length > 0 && (
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-amber-400 block mb-1">Required Documents:</span>
                  <div className="flex flex-wrap gap-1">
                    {msg.documents.map((doc, dIdx) => (
                      <span key={dIdx} className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                        • {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-5 h-5" />
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Formulating grounded scheme answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={startVoiceInput}
          className={`p-3.5 rounded-xl border transition ${
            isListening
              ? 'bg-red-600 text-white border-red-400 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-indigo-400 border-slate-700'
          }`}
          title="Voice Speech Input"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('type_question_placeholder')}
          className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={!query.trim() || loading}
          className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t('send')}</span>
        </button>
      </div>

    </div>
  );
}
