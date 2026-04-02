import React from 'react';
import { Search, Info, Building2, Ruler, MapPin } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export function ZoningRules() {
  const [district, setDistrict] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [rules, setRules] = React.useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district) return;
    setLoading(true);
    try {
      const result = await geminiService.getZoningRules(district);
      setRules(result || "No rules found for this district.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-primary text-white rounded-3xl shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Zoning & Construction Rules</h2>
          <p className="text-emerald-100 mb-6 max-w-lg">
            Get instant access to government regulations for any district. Stay compliant and avoid legal disputes.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Enter District Name (e.g. Gasabo)"
                className="w-full pl-10 pr-4 py-3 bg-white text-stone-900 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-accent hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-amber-900/20 cursor-pointer"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>

      {rules && (
        <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Regulations for {district}</h3>
          </div>
          <div className="prose prose-stone max-w-none">
            <ReactMarkdown>{rules}</ReactMarkdown>
          </div>
        </div>
      )}

      {!rules && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Building2, title: 'Height Limits', desc: 'Maximum building heights allowed per zone.' },
            { icon: Ruler, title: 'Setbacks', desc: 'Required distance from property lines.' },
            { icon: Info, title: 'Land Use', desc: 'Permitted commercial vs residential activities.' },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-stone-100 rounded-2xl border border-stone-200 hover:bg-stone-200 hover:border-stone-300 transition-all cursor-default group">
              <item.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-sm text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
