import React from 'react';
import { 
  Map as MapIcon, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Menu, 
  X, 
  LayoutDashboard,
  Search,
  Bell,
  User,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LandMap } from './components/LandMap';
import { DocumentCenter } from './components/DocumentCenter';
import { TrackingCenter } from './components/TrackingCenter';
import { ZoningRules } from './components/ZoningRules';
import { AIChatbot } from './components/AIChatbot';
import { LandSearch } from './components/LandSearch';
import { MyProperties } from './components/MyProperties';
import { Settings } from 'lucide-react';

type Tab = 'dashboard' | 'map' | 'documents' | 'tracking' | 'zoning' | 'settings' | 'properties';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [documents, setDocuments] = React.useState([
    { name: 'Land_Title_P102.pdf', date: '2024-02-28', status: 'Verified' },
    { name: 'Sale_Agreement_Final.pdf', date: '2024-01-15', status: 'Verified' },
  ]);

  const [notifications, setNotifications] = React.useState([
    { id: 1, title: 'Document Verified', message: 'Your land title for P-102 has been verified.', time: '2h ago', unread: true, tab: 'documents' as Tab },
    { id: 2, title: 'Application Update', message: 'Transfer APP-001 is now in review.', time: '1d ago', unread: false, tab: 'tracking' as Tab },
    { id: 3, title: 'New Zoning Rule', message: 'Updated building heights for Gasabo district.', time: '3d ago', unread: false, tab: 'zoning' as Tab },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notification: any) => {
    setActiveTab(notification.tab);
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n));
    setIsNotificationsOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Land Map', icon: MapIcon },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'tracking', label: 'Applications', icon: Activity },
    { id: 'zoning', label: 'Zoning Rules', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-stone-900">TerraTrust</h1>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Citizen Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-md shadow-emerald-900/10' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-stone-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
              <img src="https://picsum.photos/seed/user123/100/100" alt="User" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-sm font-bold">Irakoze William</p>
              <p className="text-xs text-stone-400">Citizen ID: 1994-8021</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between z-20">
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search records, laws, or parcels..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 rounded-xl transition-all active:scale-90 relative cursor-pointer ${isNotificationsOpen ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'}`}
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                      <h3 className="font-bold">Notifications</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-primary font-bold hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-4 border-b border-stone-50 hover:bg-stone-50 transition-colors cursor-pointer ${n.unread ? 'bg-emerald-50/30' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-bold">{n.title}</p>
                            <span className="text-[10px] text-stone-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('dashboard');
                        setIsNotificationsOpen(false);
                      }}
                      className="w-full p-3 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      View all notifications
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-stone-200 mx-2" />
            
            <div className="relative">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                  isProfileOpen ? 'bg-stone-100 text-stone-900' : 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 p-2"
                  >
                    <div className="p-3 mb-2 flex items-center gap-3 bg-stone-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                        <img src="https://picsum.photos/seed/user123/100/100" alt="User" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Irakoze William</p>
                        <p className="text-[10px] text-stone-400">Citizen ID: 1994-8021</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {[
                        { label: 'Account Settings', icon: User, tab: 'settings' as Tab },
                        { label: 'My Properties', icon: LayoutDashboard, tab: 'properties' as Tab },
                        { label: 'Security', icon: ShieldCheck, tab: 'settings' as Tab },
                      ].map((item, i) => (
                        <button 
                          key={i} 
                          onClick={() => {
                            setActiveTab(item.tab);
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ))}
                      <div className="h-px bg-stone-100 my-1" />
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                        <X className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
                      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Total Parcels</p>
                      <h3 className="text-4xl font-black">02</h3>
                      <div className="mt-4 flex items-center gap-2 text-emerald-600 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Ownership
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
                      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Active Applications</p>
                      <h3 className="text-4xl font-black">01</h3>
                      <div className="mt-4 flex items-center gap-2 text-amber-600 text-xs font-bold">
                        <Activity className="w-4 h-4" />
                        In Progress
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
                      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Disputes</p>
                      <h3 className="text-4xl font-black text-red-600">00</h3>
                      <div className="mt-4 flex items-center gap-2 text-stone-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Clear Records
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <LandSearch />
                      
                      <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          Risk Portfolio Summary
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xl">🟢</span>
                              <span className="text-xs font-black text-emerald-700">02</span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Safe Assets</p>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xl">🟡</span>
                              <span className="text-xs font-black text-amber-700">01</span>
                            </div>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Verification Needed</p>
                          </div>
                          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xl">🔴</span>
                              <span className="text-xs font-black text-red-700">00</span>
                            </div>
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Active Disputes</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-[400px]">
                        <h2 className="text-xl font-bold mb-4">Quick Map View</h2>
                        <LandMap />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {[
                          { title: 'Land Title Uploaded', desc: 'Parcel P-102 verified by AI', time: '2h ago', icon: FileText },
                          { title: 'Transfer Application', desc: 'Status updated to "Pending Review"', time: '1d ago', icon: Activity },
                          { title: 'Zoning Check', desc: 'Viewed rules for Gasabo District', time: '3d ago', icon: ShieldCheck },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-stone-100">
                            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{item.title}</p>
                              <p className="text-xs text-stone-500">{item.desc}</p>
                              <p className="text-[10px] text-stone-400 mt-1 font-medium">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'map' && <LandMap />}
              {activeTab === 'properties' && (
                <MyProperties 
                  onViewOnMap={() => setActiveTab('map')}
                  onViewDocuments={() => setActiveTab('documents')}
                />
              )}
              {activeTab === 'documents' && <DocumentCenter documents={documents} onAddDocument={(doc) => setDocuments(prev => [doc, ...prev])} />}
              {activeTab === 'tracking' && <TrackingCenter />}
              {activeTab === 'zoning' && <ZoningRules />}
              {activeTab === 'settings' && (
                <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Full Name</label>
                        <input type="text" defaultValue="Irakoze William" className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Email Address</label>
                        <input type="email" defaultValue="william@example.com" className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4">Security</h3>
                      <button className="px-6 py-2 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors">
                        Change Password
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h3>
                      <button className="px-6 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 lg:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-black text-lg">TerraTrust</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === item.id 
                        ? 'bg-primary text-white' 
                        : 'text-stone-500'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AIChatbot documents={documents} />
    </div>
  );
}
