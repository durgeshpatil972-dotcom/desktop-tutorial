import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchMarketPrices } from '../services/api';
import { Store, Search, TrendingUp, TrendingDown, Minus, Filter, Tag } from 'lucide-react';

export default function MarketPricesPage() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchMarketPrices(search, category).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [search, category]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{t('market_title')}</h2>
            <p className="text-xs text-slate-400">{t('market_subtitle')}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('filter_commodity')}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 text-xs">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                category === '' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('filter_all')}
            </button>
            <button
              onClick={() => setCategory('Crop')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                category === 'Crop' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('filter_crops')}
            </button>
            <button
              onClick={() => setCategory('Fish')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                category === 'Fish' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('filter_fish')}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Fetching e-NAM Mandi Prices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data?.listings?.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    item.category === 'Fish' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.category} • {item.variety}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">{item.commodity}</h3>
                  <p className="text-xs text-slate-400">{item.mandi}, {item.district}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block">{t('trend')}</span>
                  <div className={`flex items-center justify-end gap-1 text-xs font-bold ${
                    item.trend === 'up' ? 'text-emerald-400' : item.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : item.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    <span>{item.price_change}</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('modal_price')}</span>
                  <span className="text-xl font-black text-amber-400">₹ {item.modal_price.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ {item.unit}</span>
                </div>

                <div className="text-right border-l border-slate-800 pl-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('range')}</span>
                  <span className="text-xs font-bold text-slate-200">₹{item.min_price} - ₹{item.max_price}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Verified e-NAM Listing</span>
                <span>{item.date}</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
