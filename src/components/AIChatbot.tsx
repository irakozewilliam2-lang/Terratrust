import React from 'react';
import { MessageSquare, Send, User, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';

interface Document {
  name: string;
  date: string;
  status: string;
}

interface AIChatbotProps {
  documents: Document[];
}

export function AIChatbot({ documents }: AIChatbotProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [chat, setChat] = React.useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am TerraTrust AI. How can I help you with land boundaries or zoning rules today?' }
  ]);
  const [loading, setLoading] = React.useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const docContext = documents.length > 0 
        ? `The user has the following documents in their "My Documents" section: ${documents.map(d => `${d.name} (Status: ${d.status}, Date: ${d.date})`).join(', ')}.`
        : "The user has no documents uploaded yet.";

      const response = await geminiService.chat(userMsg, [], docContext);
      setChat(prev => [...prev, { role: 'bot', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-stone-200"
          >
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-bold">TerraTrust AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-stone-100 text-stone-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-2 bg-primary text-white rounded-xl hover:bg-emerald-700 active:scale-90 transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
