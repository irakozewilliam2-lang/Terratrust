import React from 'react';
import { FileText, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { geminiService } from '../services/geminiService';

interface Document {
  name: string;
  date: string;
  status: string;
}

interface DocumentCenterProps {
  documents: Document[];
  onAddDocument: (doc: Document) => void;
}

export function DocumentCenter({ documents, onAddDocument }: DocumentCenterProps) {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await geminiService.analyzeDocument(base64, file.type);
        setAnalysisResult(result || "Could not analyze document.");
        
        // Add to list
        onAddDocument({
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          status: 'Verified'
        });
        
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Secure Upload
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            Upload land titles, sale agreements, or survey maps for AI verification and secure storage.
          </p>
          
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 hover:border-primary transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-stone-400 mb-2 group-hover:text-primary transition-colors" />
              <p className="text-sm text-stone-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-stone-400 mt-1">PDF, PNG, JPG (Max 10MB)</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
          </label>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            AI Analysis
          </h2>
          {analyzing ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-stone-500 font-medium">Analyzing document structure...</p>
            </div>
          ) : analysisResult ? (
            <div className="h-40 overflow-y-auto text-sm text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
              {analysisResult}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-stone-400">
              <FileText className="w-12 h-12 mb-2 opacity-10" />
              <p className="text-sm">Upload a document to see AI insights</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">My Documents</h2>
        <div className="space-y-3">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100 hover:bg-stone-100 hover:border-stone-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-sm font-bold">{doc.name}</p>
                  <p className="text-xs text-stone-500">{doc.date}</p>
                </div>
              </div>
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
