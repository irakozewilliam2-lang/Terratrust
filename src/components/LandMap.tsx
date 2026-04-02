import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Layers, Map as MapIcon, Info } from 'lucide-react';

// Mock parcels
const MOCK_PARCELS = [
  {
    id: 'P-101',
    owner: 'John Doe',
    use: 'Residential',
    coords: [[-1.9441, 30.0619], [-1.9441, 30.0625], [-1.9448, 30.0625], [-1.9448, 30.0619]] as [number, number][],
    color: '#10b981',
    risk: 'safe'
  },
  {
    id: 'P-102',
    owner: 'Irakoze William',
    use: 'Commercial',
    coords: [[-1.9450, 30.0619], [-1.9450, 30.0625], [-1.9457, 30.0625], [-1.9457, 30.0619]] as [number, number][],
    color: '#3b82f6',
    risk: 'safe'
  },
  {
    id: 'P-103',
    owner: 'Jane Smith',
    use: 'Mixed Use',
    coords: [[-1.9441, 30.0630], [-1.9441, 30.0636], [-1.9457, 30.0636], [-1.9457, 30.0630]] as [number, number][],
    color: '#f59e0b',
    risk: 'warning'
  }
];

const getRiskIndicator = (risk: string) => {
  switch (risk) {
    case 'safe': return { label: 'Safe', color: 'text-emerald-600', icon: '🟢' };
    case 'warning': return { label: 'Needs Verification', color: 'text-amber-600', icon: '🟡' };
    case 'danger': return { label: 'High Risk', color: 'text-red-600', icon: '🔴' };
    default: return { label: 'Unknown', color: 'text-stone-400', icon: '⚪' };
  }
};

const LEGEND = [
  { label: 'Residential', color: '#10b981' },
  { label: 'Commercial', color: '#3b82f6' },
  { label: 'Public Space', color: '#f59e0b' },
];

export function LandMap() {
  const [search, setSearch] = React.useState('');
  const [center, setCenter] = React.useState<[number, number]>([-1.9441, 30.0619]);
  const [mapType, setMapType] = React.useState<'street' | 'satellite'>('street');

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-[1000] w-64">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Parcel ID..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
        </div>
      </div>

      {/* Map Type Toggle */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
          className="p-2 bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-stone-50 transition-all active:scale-95 cursor-pointer group"
          title="Toggle Satellite View"
        >
          {mapType === 'street' ? (
            <Layers className="w-5 h-5 text-stone-600 group-hover:text-primary" />
          ) : (
            <MapIcon className="w-5 h-5 text-stone-600 group-hover:text-primary" />
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-stone-200 shadow-lg">
        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Map Legend
        </h4>
        <div className="space-y-2">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-medium text-stone-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Map (Overview) */}
      <div className="absolute bottom-6 right-6 z-[1000] w-32 h-32 bg-white rounded-xl border-2 border-white shadow-2xl overflow-hidden pointer-events-none hidden md:block">
        <MapContainer center={center} zoom={12} zoomControl={false} dragging={false} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Indicator for current view */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary bg-primary/20 rounded-sm animate-pulse" />
          </div>
        </MapContainer>
        <div className="absolute top-1 left-1 bg-stone-900/80 text-[8px] text-white px-1 rounded font-bold uppercase tracking-tighter z-[2000]">
          Overview
        </div>
      </div>

      <MapContainer center={center} zoom={16} scrollWheelZoom={true} className="h-full w-full">
        {mapType === 'street' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        
        {MOCK_PARCELS.map((parcel) => (
          <Polygon
            key={parcel.id}
            positions={parcel.coords}
            pathOptions={{
              fillColor: parcel.color,
              fillOpacity: 0.4,
              color: parcel.color,
              weight: 2
            }}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.7, weight: 3 });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.4, weight: 2 });
              }
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{parcel.id}</h3>
                  <span className="text-sm" title={getRiskIndicator(parcel.risk).label}>
                    {getRiskIndicator(parcel.risk).icon}
                  </span>
                </div>
                <p className="text-sm text-stone-600">Owner: {parcel.owner}</p>
                <p className="text-sm text-stone-600">Use: {parcel.use}</p>
                <div className={`text-[10px] font-bold uppercase mt-2 ${getRiskIndicator(parcel.risk).color}`}>
                  Status: {getRiskIndicator(parcel.risk).label}
                </div>
                <button className="mt-3 w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-all cursor-pointer">
                  View Full Details
                </button>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}
