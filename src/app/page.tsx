"use client";

import React, { useState } from 'react';
import FanInterface from '@/components/FanInterface';
import SecurityDashboard, { Incident } from '@/components/SecurityDashboard';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const handleIncidentReported = (data: any) => {
    const newIncident: Incident = {
      id: Math.random().toString(36).substring(7),
      crisisType: data.crisisType || 'Emergency',
      location: data.location || 'Unknown',
      identifiers: data.identifiers || 'None',
      translatedMessage: data.translatedMessage || 'No message provided',
      timestamp: new Date()
    };
    
    // Add new incident to the top of the list
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleClearIncident = (id: string) => {
    setIncidents(prev => prev.filter(incident => incident.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-rose-500 to-blue-500 p-2 rounded-lg">
              <ShieldCheck className="text-white" size={24} aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Aura <span className="text-slate-400 font-normal">Guardian Module</span>
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-400 hidden sm:block">
            FIFA World Cup 2026 - Operations
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Real-time Crisis Resolution</h2>
          <p className="text-slate-400 leading-relaxed">
            This module demonstrates the GenAI pipeline. Fans can submit emergencies in their native language using the mobile view on the left. 
            The LLM autonomously parses the intent, extracts location data, and populates the Security Command Center on the right while responding to the fan sympathetically.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Mobile View Simulator for Fan */}
          <section className="lg:col-span-5 w-full flex flex-col items-center" aria-labelledby="fan-view-title">
            <h3 id="fan-view-title" className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Fan Mobile View</h3>
            {/* Phone Frame */}
            <div className="w-full max-w-[400px] border-[8px] border-slate-800 rounded-[2.5rem] bg-slate-950 p-2 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-10"></div>
              <div className="h-[750px] w-full overflow-y-auto rounded-[1.8rem] bg-slate-900 scrollbar-hide">
                <FanInterface onIncidentReported={handleIncidentReported} />
              </div>
            </div>
          </section>

          {/* Desktop Dashboard Simulator for Security */}
          <section className="lg:col-span-7 h-full flex flex-col" aria-labelledby="dashboard-view-title">
             <h3 id="dashboard-view-title" className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center lg:text-left">Security Control Room</h3>
             <div className="flex-1 min-h-[750px]">
               <SecurityDashboard incidents={incidents} onClear={handleClearIncident} />
             </div>
          </section>

        </div>
      </div>
    </main>
  );
}
