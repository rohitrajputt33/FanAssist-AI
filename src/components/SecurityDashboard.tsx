"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { ShieldAlert, MapPin, AlertCircle, RefreshCw, Activity, CheckCircle2, Watch, MessageSquareText, MonitorPlay, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StadiumMap from './StadiumMap';
import PAAnnouncementModal from './PAAnnouncementModal';
import DigitalTwinChat from './DigitalTwinChat';

/**
 * Data structure representing a fully processed incident in the Command Center.
 * Contains all fields extracted and enriched by the GenAI analysis pipeline.
 */
export interface Incident {
  id: string;
  crisisType: string;
  location: string;
  identifiers: string;
  translatedMessage: string;
  severity: 'Low' | 'Medium' | 'High' | 'CRITICAL';
  dispatchUnit: string;
  dispatchInstruction?: string;
  announcementScriptEn: string;
  announcementScriptEs: string;
  timestamp: Date;
}

/** Props for the SecurityDashboard component. */
interface SecurityDashboardProps {
  incidents: Incident[];
  onClear: (id: string) => void;
}

/**
 * Returns the Tailwind CSS class string for a given severity level.
 * Extracted as a pure function outside the component for efficiency.
 */
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return 'text-aurora-coral bg-aurora-coral/20 border-aurora-coral/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse';
    case 'High': return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
    case 'Medium': return 'text-aurora-amber bg-aurora-amber/20 border-aurora-amber/40';
    default: return 'text-aurora-mint bg-aurora-mint/20 border-aurora-mint/40';
  }
}

/**
 * AURA OS Command Center Dashboard.
 * Provides real-time operational intelligence by displaying live incidents,
 * a digital twin chat interface, and an interactive stadium map for
 * crowd management and real-time decision support during FIFA World Cup 2026.
 *
 * @param {SecurityDashboardProps} props - Component properties.
 * @returns {React.ReactElement} The SecurityDashboard component.
 */
export default function SecurityDashboard({ incidents, onClear }: SecurityDashboardProps) {
  const [activeModalIncident, setActiveModalIncident] = useState<Incident | null>(null);

  const activeLocation = useMemo(() => incidents.length > 0 ? incidents[0].location : undefined, [incidents]);

  const handleResolve = useCallback((incident: Incident) => {
    setActiveModalIncident(incident);
    onClear(incident.id);
  }, [onClear]);

  const isCodeRed = useMemo(() => incidents.some(i => i.severity === 'CRITICAL'), [incidents]);

  return (
    <div className={`w-full backdrop-blur-2xl rounded-2xl border overflow-hidden flex flex-col h-full min-h-[800px] transition-all duration-700 ${isCodeRed ? 'bg-black/60 border-aurora-coral shadow-[0_0_80px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'}`}>
      <div className={`p-5 flex justify-between items-center border-b transition-colors duration-700 ${isCodeRed ? 'bg-aurora-coral/20 border-aurora-coral/50' : 'bg-white/5 border-white/10'}`}>
        <h2 className="text-white text-xl font-bold flex items-center gap-3 uppercase tracking-widest">
          <ShieldAlert className={isCodeRed ? 'text-aurora-coral animate-bounce' : 'text-aurora-cyan'} aria-hidden="true" />
          <span>{isCodeRed ? 'MOSES PROTOCOL ENGAGED - CODE RED' : 'AURA OS // COMMAND CENTER'}</span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCodeRed ? 'bg-aurora-coral' : 'bg-aurora-mint'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isCodeRed ? 'bg-aurora-coral' : 'bg-aurora-mint'}`}></span>
          </span>
          <span className={`text-sm font-mono tracking-widest ${isCodeRed ? 'text-aurora-coral font-bold drop-shadow-md' : 'text-slate-300'}`}>
            {isCodeRed ? 'EMERGENCY_OVERRIDE' : 'SYS_ONLINE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10">
        <div className="p-5 bg-white/[0.02] border-r border-white/10">
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em] mb-4">
            <Activity size={14} className="text-aurora-indigo" aria-hidden="true" /> Live Sector Map
          </div>
          <StadiumMap activeLocation={activeLocation} />
        </div>
        <div className="p-5 bg-white/[0.01]">
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em] mb-4">
            <MessageSquareText size={14} className="text-aurora-cyan" aria-hidden="true" /> Digital Twin Chat
          </div>
          <DigitalTwinChat />
        </div>
      </div>

      <div className="p-4 bg-white/[0.03] text-[10px] font-mono text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em] border-b border-white/10">
        <RefreshCw size={14} className="animate-spin-slow text-aurora-indigo" aria-hidden="true" />
        Live Vision AI Incident Feed // Awaiting Inputs...
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide bg-black/10" role="log" aria-live="polite">
        <AnimatePresence>
          {incidents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-slate-400 mt-10 font-mono"
            >
              <CheckCircle2 size={48} className="mb-4 opacity-30 text-aurora-mint" aria-hidden="true" />
              <p className="tracking-widest uppercase text-sm drop-shadow-md">NO ACTIVE INCIDENTS</p>
            </motion.div>
          ) : (
            incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-2xl relative group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1 border ${getSeverityColor(incident.severity)}`}>
                      <AlertCircle size={12} />
                      {incident.severity}
                    </span>
                    <span className="bg-white/10 text-white px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest border border-white/20">
                      {incident.crisisType}
                    </span>
                    <span className="text-slate-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                      <MapPin size={12} className="text-aurora-cyan" />
                      LOC: {incident.location}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest shrink-0">
                    {incident.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="bg-black/30 p-5 rounded-lg mb-4 border border-white/5">
                  <p className="text-[10px] text-aurora-cyan font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Camera size={12} /> {/* Vision AI Analysis Output */}
                  </p>
                  <p className="text-white text-sm font-medium leading-relaxed tracking-wide drop-shadow-sm">&quot;{incident.translatedMessage}&quot;</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 mt-4">
                  {incident.dispatchUnit && (
                    <div className="bg-aurora-indigo/10 rounded-lg p-4 border border-aurora-indigo/30">
                      <p className="text-[10px] text-aurora-indigo font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Watch size={12} /> {/* &quot;Whisper&quot; Autonomous Routing */}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono bg-aurora-indigo/30 text-indigo-100 px-2 py-1 rounded border border-aurora-indigo/50 tracking-widest uppercase">
                          TARGET: {incident.dispatchUnit}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 font-mono mt-3 leading-relaxed border-l-2 border-aurora-indigo/50 pl-3">&quot;{incident.dispatchInstruction || 'Please head to the location to assist.'}&quot;</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleResolve(incident)}
                  className="mt-6 w-full sm:w-auto bg-aurora-indigo hover:bg-indigo-500 text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-md shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all focus:ring-4 focus:ring-aurora-indigo/50 flex items-center justify-center gap-2"
                  aria-label={`Override Digital Signs: ${incident.crisisType}`}
                >
                  <MonitorPlay size={16} /> Override Signs & Resolve
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <PAAnnouncementModal 
        isOpen={activeModalIncident !== null} 
        onClose={() => setActiveModalIncident(null)} 
        scriptEn={activeModalIncident?.announcementScriptEn || ''}
        scriptEs={activeModalIncident?.announcementScriptEs || ''}
      />
    </div>
  );
}
