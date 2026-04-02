import React from 'react';
import { Search, User, Maximize, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandRecord {
  plotNumber: string;
  ownerName: string;
  idNumber: string;
  landSize: string;
  zoningType: string;
  documentStatus: string;
  riskStatus: 'safe' | 'warning' | 'danger';
  riskFactors: string[];
}

const MOCK_RECORDS: LandRecord[] = [
  {
    plotNumber: 'P-101',
    ownerName: 'John Doe',
    idNumber: '1985-4032',
    landSize: '450 sqm',
    zoningType: 'Residential (R1)',
    documentStatus: 'Verified',
    riskStatus: 'safe',
    riskFactors: []
  },
  {
    plotNumber: 'P-102',
    ownerName: 'Irakoze William',
    idNumber: '1994-8021',
    landSize: '1,200 sqm',
    zoningType: 'Commercial (C1)',
    documentStatus: 'Verified',
    riskStatus: 'safe',
    riskFactors: []
  },
  {
    plotNumber: 'P-103',
    ownerName: 'Jane Smith',
    idNumber: '1990-1122',
    landSize: '800 sqm',
    zoningType: 'Mixed Use',
    documentStatus: 'Pending',
    riskStatus: 'warning',
    riskFactors: ['Missing survey map', 'Zoning review required']
  },
  {
    plotNumber: 'P-104',
    ownerName: 'Unknown',
    idNumber: 'N/A',
    landSize: '2,500 sqm',
    zoningType: 'Industrial',
    documentStatus: 'Disputed',
    riskStatus: 'danger',
    riskFactors: ['Conflicting ownership claim', 'Zoning violation: Height limit exceeded']
  }
];

export function LandSearch() {
  const [query, setQuery] = React.useState('');
  const [result, setResult] = React.useState<LandRecord | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const getRiskBadge = (status: LandRecord['riskStatus']) => {
    switch (status) {
      case 'safe': return { label: 'Safe', color: 'bg-emerald-100 text-emerald-700', icon: '🟢' };
      case 'warning': return { label: 'Needs Verification', color: 'bg-amber-100 text-amber-700', icon: '🟡' };
      case 'danger': return { label: 'High Risk / Dispute', color: 'bg-red-100 text-red-700', icon: '🔴' };
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const found = MOCK_RECORDS.find(r => 
      r.plotNumber.toLowerCase() === query.toLowerCase() ||
      r.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      r.idNumber === query
    );

    setResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-100 bg-stone-50/50">
        <h2 className="text-xl font-bold mb-1">Public Land Registry Search</h2>
        <p className="text-sm text-stone-500">Search by Plot Number, Owner Name, or National ID</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="e.g. P-102 or Irakoze William"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 active:scale-95 transition-all shadow-lg shadow-stone-900/10 cursor-pointer"
          >
            Search
          </button>
        </form>

        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getRiskBadge(result.riskStatus).icon}</span>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Risk Assessment</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRiskBadge(result.riskStatus).color}`}>
                          {getRiskBadge(result.riskStatus).label}
                        </span>
                      </div>
                    </div>
                    {result.riskFactors.length > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Key Issues</p>
                        <div className="flex flex-wrap justify-end gap-1">
                          {result.riskFactors.map((f, i) => (
                            <span key={i} className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Owner Name</p>
                        <p className="text-lg font-black text-stone-900">{result.ownerName}</p>
                        <p className="text-xs text-stone-500">ID: {result.idNumber}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-600 shadow-sm">
                        <Maximize className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Land Size</p>
                        <p className="text-lg font-black text-stone-900">{result.landSize}</p>
                        <p className="text-xs text-stone-500">Plot: {result.plotNumber}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-600 shadow-sm">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Zoning Type</p>
                        <p className="text-lg font-black text-stone-900">{result.zoningType}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-600 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Document Status</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-black text-stone-900">{result.documentStatus}</p>
                          <span className={`w-2 h-2 rounded-full ${result.documentStatus === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 text-center">
                  <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="font-bold text-stone-900">No records found</p>
                  <p className="text-sm text-stone-500">We couldn't find any land records matching "{query}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
