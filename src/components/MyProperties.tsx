import React from 'react';
import { MapPin, Maximize, ShieldCheck, FileText, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface Property {
  id: string;
  address: string;
  size: string;
  zoning: string;
  riskStatus: 'safe' | 'warning' | 'danger';
  verificationStatus: 'Verified' | 'Pending' | 'Disputed';
  thumbnail: string;
}

const MY_PROPERTIES: Property[] = [
  {
    id: 'P-102',
    address: 'Gasabo, Kigali - Plot 402',
    size: '1,200 sqm',
    zoning: 'Commercial (C1)',
    riskStatus: 'safe',
    verificationStatus: 'Verified',
    thumbnail: 'https://picsum.photos/seed/property1/400/300'
  },
  {
    id: 'P-105',
    address: 'Kicukiro, Kigali - Plot 88',
    size: '600 sqm',
    zoning: 'Residential (R1)',
    riskStatus: 'warning',
    verificationStatus: 'Pending',
    thumbnail: 'https://picsum.photos/seed/property2/400/300'
  }
];

interface MyPropertiesProps {
  onViewOnMap: (id: string) => void;
  onViewDocuments: () => void;
}

export function MyProperties({ onViewOnMap, onViewDocuments }: MyPropertiesProps) {
  const getRiskBadge = (status: Property['riskStatus']) => {
    switch (status) {
      case 'safe': return { label: 'Safe Asset', color: 'bg-emerald-100 text-emerald-700', icon: '🟢' };
      case 'warning': return { label: 'Action Required', color: 'bg-amber-100 text-amber-700', icon: '🟡' };
      case 'danger': return { label: 'High Risk', color: 'bg-red-100 text-red-700', icon: '🔴' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">My Properties</h2>
          <p className="text-stone-500">Manage your verified land assets and track their status.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-stone-100 rounded-xl border border-stone-200 text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Assets</p>
            <p className="text-xl font-black text-stone-900">02</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified</p>
            <p className="text-xl font-black text-emerald-900">01</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MY_PROPERTIES.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={property.thumbnail} 
                alt={property.address}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getRiskBadge(property.riskStatus).color} backdrop-blur-md bg-opacity-90`}>
                  {getRiskBadge(property.riskStatus).icon} {getRiskBadge(property.riskStatus).label}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-stone-200 shadow-sm">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Plot ID</p>
                  <p className="text-sm font-black text-stone-900">{property.id}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400" />
                    {property.address}
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <Maximize className="w-3 h-3" />
                      {property.size}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <ShieldCheck className="w-3 h-3" />
                      {property.zoning}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${property.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {property.verificationStatus}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onViewOnMap(property.id)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-all active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Map
                </button>
                <button 
                  onClick={onViewDocuments}
                  className="flex items-center justify-center gap-2 py-2.5 bg-stone-100 text-stone-900 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all active:scale-95 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  Documents
                </button>
              </div>
              
              <button className="w-full mt-3 flex items-center justify-center gap-2 py-2 border border-stone-200 text-stone-500 text-[10px] font-bold rounded-xl hover:bg-stone-50 transition-all cursor-pointer">
                <Download className="w-3 h-3" />
                Download Digital Title (PDF)
              </button>
            </div>
          </motion.div>
        ))}

        <button className="border-2 border-dashed border-stone-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-stone-50 transition-all group cursor-pointer">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <Maximize className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold text-stone-900">Register New Property</p>
            <p className="text-xs text-stone-500">Start the application for a new land parcel</p>
          </div>
        </button>
      </div>
    </div>
  );
}
