import React from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, MapPin, FileText, Upload, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';

interface Application {
  id: string;
  type: string;
  status: string;
  date: string;
  applicant: string;
  parcelId: string;
}

interface Dispute {
  id: string;
  parcelId: string;
  status: string;
  description: string;
  date: string;
}

export function TrackingCenter() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [disputes, setDisputes] = React.useState<Dispute[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [verificationStatus, setVerificationStatus] = React.useState<'idle' | 'analyzing' | 'verified' | 'failed'>('idle');
  const [verificationMessage, setVerificationMessage] = React.useState('');

  const [newDispute, setNewDispute] = React.useState({ parcelId: '', description: '' });

  const USER_NAME = "Irakoze William";

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, dispRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/disputes')
      ]);
      const [appData, dispData] = await Promise.all([appRes.json(), dispRes.json()]);
      setApplications(appData);
      setDisputes(dispData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOwnership = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerificationStatus('analyzing');
    setVerificationMessage('AI is analyzing your document...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await geminiService.analyzeDocument(base64, file.type);
        
        // Simple check: does the result contain the user's name?
        if (result?.toLowerCase().includes(USER_NAME.toLowerCase())) {
          setVerificationStatus('verified');
          setVerificationMessage(`Ownership verified for ${USER_NAME}.`);
        } else {
          setVerificationStatus('failed');
          setVerificationMessage('Verification failed. Owner name in document does not match your profile.');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setVerificationStatus('failed');
      setVerificationMessage('An error occurred during verification.');
    }
  };

  const submitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispute)
      });
      setNewDispute({ parcelId: '', description: '' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                Property Ownership Verification
              </h2>
              <p className="text-emerald-700 text-sm mt-1">
                Upload your land title to instantly verify ownership against your profile.
              </p>
            </div>
            {verificationStatus === 'verified' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold animate-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
                VERIFIED
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              verificationStatus === 'verified' ? 'border-emerald-500 bg-emerald-100/50' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/30'
            }`}>
              <Upload className={`w-8 h-8 mb-2 ${verificationStatus === 'verified' ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <span className="text-sm font-bold text-emerald-800">
                {verificationStatus === 'verified' ? 'Upload Another' : 'Upload Land Title'}
              </span>
              <input type="file" className="hidden" onChange={handleVerifyOwnership} accept=".pdf,.png,.jpg,.jpeg" />
            </label>

            <div className="flex flex-col justify-center p-6 bg-white/50 rounded-2xl border border-emerald-100">
              <AnimatePresence mode="wait">
                {verificationStatus === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-emerald-600/60 italic text-sm">
                    No document uploaded yet
                  </motion.div>
                )}
                {verificationStatus === 'analyzing' && (
                  <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                    <p className="text-sm font-medium text-emerald-800">{verificationMessage}</p>
                  </motion.div>
                )}
                {verificationStatus === 'verified' && (
                  <motion.div key="verified" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <p className="text-sm font-bold text-emerald-700 mb-1">Success!</p>
                    <p className="text-xs text-emerald-600">{verificationMessage}</p>
                  </motion.div>
                )}
                {verificationStatus === 'failed' && (
                  <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <p className="text-sm font-bold text-red-600 mb-1">Verification Failed</p>
                    <p className="text-xs text-red-500">{verificationMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Active Applications
          </h2>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="group p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{app.type}</span>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{app.id}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Parcel: {app.parcelId}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Submitted: {app.date}
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-primary transition-all duration-1000 ${app.status === 'Approved' ? 'w-full' : 'w-1/3'}`} />
                  </div>
                  <span className="text-xs font-medium text-stone-400">
                    {app.status === 'Approved' ? '100%' : '33%'} Complete
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            Boundary Disputes
          </h2>
          <div className="space-y-4">
            {disputes.map((disp) => (
              <div key={disp.id} className="p-6 bg-red-50/50 rounded-2xl border border-red-100 hover:bg-red-50 transition-colors cursor-default">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-red-900">{disp.id} - Parcel {disp.parcelId}</h3>
                  <span className="text-xs font-bold text-red-600 uppercase">{disp.status}</span>
                </div>
                <p className="text-sm text-red-800 mb-2">{disp.description}</p>
                <p className="text-xs text-red-600/60">Reported on {disp.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-8">
        <section className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Report a Dispute</h2>
          <form onSubmit={submitDispute} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Parcel ID</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                value={newDispute.parcelId}
                onChange={(e) => setNewDispute({ ...newDispute, parcelId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Description</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                value={newDispute.description}
                onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
              />
            </div>
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20">
              Submit Report
            </button>
          </form>
        </section>

        <section className="p-6 bg-emerald-900 text-white rounded-2xl shadow-xl group cursor-pointer hover:bg-emerald-950 transition-colors">
          <h2 className="text-xl font-bold mb-2">Need Help?</h2>
          <p className="text-emerald-100 text-sm mb-4">
            Our legal team is available for consultation regarding land disputes and transfers.
          </p>
          <button className="flex items-center gap-2 text-sm font-bold text-accent group-hover:gap-3 transition-all">
            Contact Support <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </div>
  );
}
