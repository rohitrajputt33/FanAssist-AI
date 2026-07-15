"use client";

import React, { useState } from 'react';
import { ShieldAlert, MapPin, AlertCircle, RefreshCw, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StadiumMap from './StadiumMap';
import PAAnnouncementModal from './PAAnnouncementModal';

export interface Incident {
  id: string;
  crisisType: string;
  location: string;
  identifiers: string;
  translatedMessage: string;
  severity: 'Low' | 'Medium' | 'High';
  dispatchUnit: string;
  announcementScriptEn: string;
  announcementScriptEs: string;
  timestamp: Date;
}

interface SecurityDashboardProps {
  incidents: Incident[];
  onClear: (id: string) => void;
}

export default function SecurityDashboard({ incidents, onClear }: SecurityDashboardProps) {
  const [activeModalIncident, setActiveModalIncident] = useState<Incident | null>(null);

  const activeLocation = incidents.length > 0 ? incidents[0].location : undefined;

  const handleResolve = (incident: Incident) => {
    setActiveModalIncident(incident);
    onClear(incident.id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col h-full min-h-[700px]">
      <div className="bg-slate-800/80 p-5 flex justify-between items-center border-b border-slate-700/50">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-blue-500" aria-hidden="true" />
          <span>FanAssist AI Command Center</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">System Active</span>
        </div>
      </div>

      <div className="p-4 bg-slate-800/40 border-b border-slate-700/50">
        <div className="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider mb-3">
          <Activity size={14} aria-hidden="true" /> Live Stadium Sector Map
        </div>
        <StadiumMap activeLocation={activeLocation} />
      </div>

      <div className="p-4 bg-slate-800/30 text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider border-b border-slate-700/30">
        <RefreshCw size={14} className="animate-spin-slow" aria-hidden="true" />
        Live AI Incident Feed
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide" role="log" aria-live="polite">
        <AnimatePresence>
          {incidents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-slate-500 mt-10"
            >
              <CheckCircle2 size={48} className="mb-4 opacity-50 text-green-500" aria-hidden="true" />
              <p>All clear. No active incidents.</p>
            </motion.div>
          ) : (
            incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.1 }} // Staggered entrance
                className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-xl relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${getSeverityColor(incident.severity)}`}>
                      <AlertCircle size={14} />
                      {incident.severity} SEVERITY
                    </span>
                    <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-slate-600">
                      {incident.crisisType}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded-md">
                      <MapPin size={14} />
                      {incident.location}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono shrink-0">
                    {incident.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-white text-lg font-medium mb-3 leading-relaxed">"{incident.translatedMessage}"</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {incident.identifiers && incident.identifiers !== 'Unknown' && (
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Key Identifiers</p>
                      <p className="text-sm text-blue-300 font-medium">{incident.identifiers}</p>
                    </div>
                  )}
                  {incident.dispatchUnit && (
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">AI Recommended Dispatch</p>
                      <p className="text-sm text-amber-300 font-medium">{incident.dispatchUnit}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleResolve(incident)}
                  className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-green-400"
                  aria-label={`Resolve incident: ${incident.crisisType}`}
                >
                  Resolve & Announce
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
