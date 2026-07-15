"use client";

import React from 'react';
import { ShieldAlert, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Incident {
  id: string;
  crisisType: string;
  location: string;
  identifiers: string;
  translatedMessage: string;
  timestamp: Date;
}

interface SecurityDashboardProps {
  incidents: Incident[];
  onClear: (id: string) => void;
}

export default function SecurityDashboard({ incidents, onClear }: SecurityDashboardProps) {
  return (
    <div className="w-full bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="bg-slate-800 p-5 flex justify-between items-center border-b border-slate-700">
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

      <div className="p-4 bg-slate-800/50 text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <RefreshCw size={14} className="animate-spin-slow" aria-hidden="true" />
        Live Incident Feed
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4" role="log" aria-live="polite">
        <AnimatePresence>
          {incidents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-slate-500"
            >
              <ShieldAlert size={48} className="mb-4 opacity-50" aria-hidden="true" />
              <p>No active incidents reported.</p>
            </motion.div>
          ) : (
            incidents.map((incident) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-red-500/30">
                      <AlertCircle size={14} />
                      {incident.crisisType}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin size={14} />
                      {incident.location}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {incident.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-white text-lg font-medium mb-2">"{incident.translatedMessage}"</p>
                
                {incident.identifiers && incident.identifiers !== 'Unknown' && (
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3 border border-slate-700/50">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Key Identifiers</p>
                    <p className="text-sm text-blue-300">{incident.identifiers}</p>
                  </div>
                )}

                <button
                  onClick={() => onClear(incident.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded-lg"
                  aria-label={`Resolve incident: ${incident.crisisType}`}
                >
                  Resolve
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
