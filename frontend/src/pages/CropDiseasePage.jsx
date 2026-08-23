import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { detectCropDisease } from '../services/api';
import { Upload, Camera, Cpu, AlertTriangle, ShieldCheck, Leaf, Volume2, Sparkles } from 'lucide-react';

export default function CropDiseasePage() {
  const { t, userProfile } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !imagePreview) return;
    setLoading(true);
    const data = await detectCropDisease(selectedImage, userProfile.primaryCrop);
    setResult(data);
    setLoading(false);
  };

  const loadSampleLeaf = () => {
    // Generate an in-browser sample leaf canvas for testing without physical files
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Background green leaf
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.ellipse(150, 150, 120, 80, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();

    // Concentric brown blight spots
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.arc(130, 130, 25, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#fbc02d';
    ctx.beginPath();
    ctx.arc(130, 130, 12, 0, 2 * Math.PI);
    ctx.fill();

    canvas.toBlob((blob) => {
      const file = new File([blob], "sample_infected_leaf.jpg", { type: "image/jpeg" });
      setSelectedImage(file);
      setImagePreview(canvas.toDataURL());
      setResult(null);
    }, "image/jpeg");
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{t('ai_detector_title')}</h2>
            <p className="text-xs text-slate-400">{t('ai_detector_subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Image Upload Box */}
      <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition">
        
        {imagePreview ? (
          <div className="space-y-4">
            <img
              src={imagePreview}
              alt="Uploaded Crop Leaf"
              className="w-48 h-48 object-cover rounded-2xl mx-auto border-2 border-emerald-500 shadow-xl"
            />
            <div className="flex justify-center gap-3">
              <label className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer">
                Change Photo
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="py-2 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:opacity-90 transition flex items-center gap-2"
              >
                {loading ? <Cpu className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? t('analyzing') : 'Diagnose Disease'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">Select or Capture Leaf Image</p>
              <p className="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <label className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg flex items-center gap-2 transition">
                <Upload className="w-4 h-4" />
                <span>{t('upload_btn')}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                onClick={loadSampleLeaf}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Try Sample Demo Leaf</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Diagnosis Results Card */}
      {result && (
        <div className="bg-slate-900 border border-emerald-500/40 p-6 rounded-2xl shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-300">
          
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {t('diagnosis_result')}
              </span>
              <h3 className="text-2xl font-black text-white mt-2">{result.disease_name}</h3>
              <p className="text-xs text-slate-400 mt-1">Crop: <span className="text-white font-bold">{result.crop}</span></p>
            </div>

            <button
              onClick={() => speakText(`${result.disease_name}. Organic remedy: ${result.remedy.organic}`)}
              className="p-3 bg-slate-800 text-emerald-400 hover:bg-slate-750 rounded-xl border border-slate-700"
              title="Listen to Remedy Audio"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">{t('confidence')}</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{result.confidence_percentage}%</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">{t('severity')}</div>
              <div className={`text-xl font-black mt-0.5 ${
                result.severity === 'High' ? 'text-red-400' : result.severity === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {result.severity}
              </div>
            </div>
          </div>

          {/* Symptoms */}
          {result.symptoms && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Observed Symptoms:
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{result.symptoms}</p>
            </div>
          )}

          {/* Organic Remedy */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl">
            <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {t('organic_remedy')}
            </h4>
            <p className="text-xs text-emerald-100 font-medium leading-relaxed">{result.remedy.organic}</p>
          </div>

          {/* Chemical Spray Remedy */}
          <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1.5">
              {t('chemical_remedy')}
            </h4>
            <p className="text-xs text-amber-100 font-medium leading-relaxed">{result.remedy.chemical}</p>
          </div>

          {/* Model info footer */}
          <div className="text-[10px] text-slate-500 font-mono text-right pt-1">
            Engine: {result.model_info}
          </div>

        </div>
      )}

    </div>
  );
}
