"use client";

import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FanInterfaceProps {
  onIncidentReported: (data: any) => void;
}

export default function FanInterface({ onIncidentReported }: FanInterfaceProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentText: message })
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg({ text: data.empatheticResponse || 'Help is on the way.', type: 'success' });
        onIncidentReported(data);
        setMessage('');
      } else {
        setResponseMsg({ text: 'Error connecting to the network. Please find a nearby steward.', type: 'error' });
      }
    } catch (err) {
      setResponseMsg({ text: 'Error connecting to the network. Please find a nearby steward.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
      <div className="bg-gradient-to-r from-red-600 to-rose-500 p-4">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <AlertTriangle aria-hidden="true" />
          <span>Aura SOS / Help</span>
        </h2>
        <p className="text-rose-100 text-sm mt-1">Describe your emergency in any language.</p>
      </div>

      <div className="p-6">
        {responseMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
              responseMsg.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-100' : 'bg-red-900/30 border border-red-800 text-red-100'
            }`}
            role="alert"
            aria-live="assertive"
          >
            {responseMsg.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={20} aria-hidden="true" /> : <AlertTriangle className="shrink-0 mt-0.5" size={20} aria-hidden="true" />}
            <p className="text-sm font-medium">{responseMsg.text}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="incidentText" className="block text-sm font-medium text-slate-300 mb-2">
              What is happening?
            </label>
            <textarea
              id="incidentText"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all disabled:opacity-50 min-h-[120px] resize-none"
              placeholder="e.g. My child is lost near Gate B. He is wearing a blue cap."
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-rose-500/50"
            aria-label="Send Emergency Alert"
          >
            {loading ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              <>
                <span>Send Alert</span>
                <Send size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
