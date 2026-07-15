"use client";

import React, { useState } from 'react';
import { Send, Mic, Globe, TriangleAlert, Activity, Eye, ShieldAlert, Ear, RefreshCw, Scan, ArrowUpCircle, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FanInterfaceProps {
  onIncidentReported: (data: any) => void;
}

export default function FanInterface({ onIncidentReported }: FanInterfaceProps) {
  const [incidentText, setIncidentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [isARActive, setIsARActive] = useState(false);

  const triggerMosesProtocol = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onIncidentReported({
        crisisType: 'Medical Emergency',
        location: 'Section 104, Row G',
        identifiers: 'Apple Watch Vitals Drop',
        translatedMessage: 'Automated Alert: Heart rate dropped below threshold. Possible cardiac event.',
        severity: 'CRITICAL',
        dispatchUnit: 'Medical Team Alpha',
        dispatchInstruction: 'Deploy Moses Protocol to clear central aisle. Medics inbound.',
        announcementScriptEn: 'Medical emergency in Section 104. Please clear the center aisle immediately.',
        announcementScriptEs: 'Emergencia médica en la Sección 104. Despejen el pasillo central inmediatamente.'
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const triggerSensoryProtocol = () => {
    setIsSubmitting(true);
    setIsARActive(true);
    setTimeout(() => {
      onIncidentReported({
        crisisType: 'Sensory Overload',
        location: 'Gate 4 Concourse',
        identifiers: 'Fan requested quiet route',
        translatedMessage: 'Fan experiencing sensory overload. Routing to Quiet Room VIP-2.',
        severity: 'Low',
        dispatchUnit: 'VIP Services',
        dispatchInstruction: 'Unlock VIP Room 2. Fan arriving via AR quiet route.'
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentText, userLanguage: language, trigger: 'TEXT' }),
      });

      if (!res.ok) throw new Error('Failed to connect to AI server');

      const data = await res.json();
      onIncidentReported(data);
      setIncidentText('');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-slate-100 relative">
      {/* Dynamic Background Glow for mobile */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent z-0 pointer-events-none"></div>

      {/* App Header */}
      <div className="pt-12 pb-4 px-6 bg-white/5 border-b border-white/10 flex justify-between items-center z-10 shrink-0 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-white">Stadium <span className="text-aurora-indigo font-normal">Connect</span></h1>
        <div className="flex gap-3">
          <Activity className="text-aurora-mint animate-pulse" size={20} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative p-6 space-y-6 scrollbar-hide z-10">
        
        <AnimatePresence>
          {isARActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 bg-slate-900 overflow-hidden"
            >
              {/* Fake AR Camera View Background */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale blur-[2px]"></div>
              
              {/* Glowing AR Path Overlay */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-full flex flex-col justify-end pb-20 opacity-80">
                <div className="w-16 h-32 mx-auto bg-aurora-mint/40 blur-xl animate-pulse"></div>
                <div className="w-8 h-64 mx-auto bg-gradient-to-t from-aurora-mint to-transparent shadow-[0_0_40px_#10b981] rounded-t-full"></div>
              </div>
              
              {/* AR UI Overlay */}
              <div className="absolute top-10 left-0 w-full px-6 z-10">
                <div className="bg-black/60 backdrop-blur-xl border border-aurora-mint/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] text-center">
                  <Eye className="mx-auto text-aurora-mint mb-2" size={24} />
                  <p className="font-bold text-aurora-mint tracking-widest uppercase text-sm mb-1">AR Wayfinding Active</p>
                  <p className="text-xs text-slate-300">Follow the green path to Quiet Room VIP-2</p>
                  <button 
                    onClick={() => setIsARActive(false)}
                    className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-300 transition-colors"
                  >
                    Exit AR View
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 space-y-6">
          <div className="bg-white/10 border border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-lg">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 drop-shadow-sm">Quick Emergency (1-Tap)</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={triggerMosesProtocol}
                disabled={isSubmitting}
                className="bg-aurora-coral/10 hover:bg-aurora-coral/20 border border-aurora-coral/30 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group shadow-[0_0_15px_rgba(244,63,94,0.1)] disabled:opacity-50"
              >
                <div className="bg-aurora-coral/20 p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldAlert className="text-aurora-coral" size={24} />
                </div>
                <span className="font-bold text-aurora-coral text-xs text-center leading-tight uppercase tracking-widest drop-shadow-md">Medical<br/>Emergency</span>
              </button>
              
              <button 
                onClick={triggerSensoryProtocol}
                disabled={isSubmitting}
                className="bg-aurora-mint/10 hover:bg-aurora-mint/20 border border-aurora-mint/30 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group shadow-[0_0_15px_rgba(16,185,129,0.1)] disabled:opacity-50"
              >
                <div className="bg-aurora-mint/20 p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Ear className="text-aurora-mint" size={24} />
                </div>
                <span className="font-bold text-aurora-mint text-xs text-center leading-tight uppercase tracking-widest drop-shadow-md">Sensory<br/>Relief Room</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
            <h3 className="font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm drop-shadow-sm">
              <TriangleAlert className="text-aurora-cyan" size={16} /> Report Custom Issue
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                placeholder="E.g., I lost my son near Gate B..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-aurora-indigo focus:ring-1 focus:ring-aurora-indigo min-h-[120px] resize-none text-white placeholder-slate-400 font-mono transition-shadow shadow-inner"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest cursor-pointer border border-white/10 hover:bg-white/10 transition-colors">
                  <Globe size={14} /> EN
                </div>
                <div className="flex gap-2">
                  <button type="button" className="p-3 bg-white/5 text-slate-300 rounded-full hover:bg-white/10 border border-white/10 transition-colors shadow-sm">
                    <Mic size={18} />
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !incidentText.trim()}
                    className="bg-aurora-indigo text-white p-3 rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:bg-white/10 disabled:text-slate-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </form>
            {error && <p className="text-aurora-coral text-xs mt-3 font-mono">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
