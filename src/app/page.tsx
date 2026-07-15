"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SecurityDashboard, { Incident } from '@/components/SecurityDashboard';
import { AnalysisResult } from '@/types';
import { ShieldCheck, LayoutDashboard, Camera, Smartphone, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/** Dynamically imported FanInterface for code-splitting (non-default tab). */
const FanInterface = dynamic(() => import('@/components/FanInterface'), {
  loading: () => <div className="h-full flex items-center justify-center text-slate-400 font-mono">Loading Fan Interface...</div>
});

/** Dynamically imported CCTVMonitor for code-splitting (non-default tab). */
const CCTVMonitor = dynamic(() => import('@/components/CCTVMonitor'), {
  loading: () => <div className="h-full flex items-center justify-center text-slate-400 font-mono">Loading CCTV Monitor...</div>
});

type Tab = 'command-center' | 'cctv' | 'fan-mobile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('command-center');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleAnalysisComplete = useCallback((data: AnalysisResult) => {
    const newIncident: Incident = {
      id: crypto.randomUUID(),
      crisisType: data.crisisType || 'Emergency',
      location: data.location || 'Unknown',
      identifiers: data.identifiers || 'None',
      translatedMessage: data.translatedMessage || 'No analysis provided',
      severity: data.severity || 'Medium',
      dispatchUnit: data.dispatchUnit || 'General Steward',
      dispatchInstruction: data.dispatchInstruction || '',
      announcementScriptEn: data.announcementScriptEn || 'Please remain calm. Security is responding.',
      announcementScriptEs: data.announcementScriptEs || 'Mantenga la calma. La seguridad está respondiendo.',
      timestamp: new Date()
    };
    
    setIncidents(prev => [newIncident, ...prev]);
    
    // Interactive Tab Switch & Popup
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setActiveTab('command-center');
  }, []);

  const handleClearIncident = useCallback((id: string) => {
    setIncidents(prev => prev.filter(incident => incident.id !== id));
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-slate-900 bg-noise text-slate-100 flex selection:bg-aurora-cyan/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-white/5 backdrop-blur-3xl border-r border-white/10 flex flex-col items-center lg:items-start transition-all z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
        <div className="h-20 w-full border-b border-white/10 flex items-center justify-center lg:justify-start lg:px-6">
          <div className="bg-aurora-indigo/20 p-2 rounded-lg shrink-0 border border-aurora-indigo/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="text-aurora-cyan" size={24} aria-hidden="true" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight text-white truncate">AURA <span className="text-aurora-indigo font-normal">OS</span></span>
        </div>

        <nav className="flex-1 w-full flex flex-col gap-2 p-4">
          <button 
            onClick={() => setActiveTab('command-center')}
            className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl transition-all duration-300 ${activeTab === 'command-center' ? 'bg-aurora-indigo/20 text-white font-bold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.4)]' : 'hover:bg-white/5 text-slate-400 hover:text-white font-medium'}`}
            aria-label="Command Center"
          >
            <LayoutDashboard size={20} className="shrink-0 mx-auto lg:mx-0 text-aurora-cyan" aria-hidden="true" />
            <span className="hidden lg:block text-sm tracking-wide uppercase">Command Center</span>
          </button>
          
          <div className="w-full h-px bg-white/10 my-2"></div>
          
          <button 
            onClick={() => setActiveTab('cctv')}
            className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl transition-all duration-300 ${activeTab === 'cctv' ? 'bg-aurora-indigo/20 text-white font-bold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.4)]' : 'hover:bg-white/5 text-slate-400 hover:text-white font-medium'}`}
            aria-label="Vision AI CCTV"
          >
            <Camera size={20} className="shrink-0 mx-auto lg:mx-0 text-aurora-cyan" aria-hidden="true" />
            <span className="hidden lg:block text-sm tracking-wide uppercase">Vision AI (CCTV)</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('fan-mobile')}
            className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl transition-all duration-300 ${activeTab === 'fan-mobile' ? 'bg-aurora-indigo/20 text-white font-bold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.4)]' : 'hover:bg-white/5 text-slate-400 hover:text-white font-medium'}`}
            aria-label="Fan SOS Mobile"
          >
            <Smartphone size={20} className="shrink-0 mx-auto lg:mx-0 text-aurora-cyan" aria-hidden="true" />
            <span className="hidden lg:block text-sm tracking-wide uppercase">Fan SOS (Mobile)</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950">
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center px-8 shrink-0 z-10">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-md">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="ml-auto flex items-center gap-4">
             <div className="h-2 w-2 rounded-full bg-aurora-cyan animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
             <div className="text-sm font-mono text-aurora-cyan/70 hidden sm:block">
               SYS_ACTIVE // FIFA 2026
             </div>
          </div>
        </header>

        {/* Tab Content area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'command-center' && (
              <motion.div 
                key="cmd" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                className="h-full max-w-[1500px] mx-auto"
              >
                <SecurityDashboard incidents={incidents} onClear={handleClearIncident} />
              </motion.div>
            )}
            
            {activeTab === 'cctv' && (
              <motion.div 
                key="cctv" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                className="h-full max-w-4xl mx-auto flex flex-col"
              >
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase drop-shadow-md">Live CCTV Analysis</h3>
                  <p className="text-slate-300 font-mono text-sm">GenAI continuously parses crowd vectors. Trigger an analysis to simulate a real-time event.</p>
                </div>
                <div className="flex-1 min-h-[600px] shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/20">
                  <CCTVMonitor onAnalysisComplete={handleAnalysisComplete} />
                </div>
              </motion.div>
            )}

            {activeTab === 'fan-mobile' && (
              <motion.div 
                key="mobile" 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
                className="h-full w-full flex flex-col items-center justify-center"
              >
                <div className="mb-8 text-center max-w-md">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase drop-shadow-md">Fan Mobile Experience</h3>
                  <p className="text-slate-300 font-mono text-sm">Fans submit incidents natively. This feeds instantly into AURA OS.</p>
                </div>
                <div className="w-[360px] h-[720px] border-[10px] border-slate-900 rounded-[3rem] bg-black p-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative shrink-0">
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-2xl w-32 mx-auto z-20"></div>
                  <div className="h-full w-full overflow-hidden rounded-[2.2rem] bg-slate-900 relative">
                    <FanInterface onIncidentReported={handleAnalysisComplete} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(99,102,241,0.3)] flex items-center gap-4 border border-aurora-indigo/50 z-50"
            >
              <div className="bg-aurora-indigo/20 p-2 rounded-full">
                <BellRing className="text-aurora-cyan animate-bounce" size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide text-aurora-cyan uppercase">New Incident Detected</p>
                <p className="text-xs text-slate-300 font-mono mt-1">Automatically routed to Command Center.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </main>
  );
}
