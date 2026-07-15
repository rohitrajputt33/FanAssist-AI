"use client";

import React, { useState } from 'react';
import { Camera, ScanEye, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CCTVMonitorProps {
  onAnalysisComplete: (data: any) => void;
}

export default function CCTVMonitor({ onAnalysisComplete }: CCTVMonitorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Send a request to our API route. We don't actually send an image
      // because we are mocking the Gemini Vision API response on the backend anyway.
      const res = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'CCTV_ANALYSIS' }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze feed');
      }

      const data = await res.json();
      onAnalysisComplete(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2 text-white font-bold tracking-wider">
          <Camera className="text-red-500" />
          <span>CCTV FEED: GATE 4</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></span>
           <span className="text-xs text-red-500 font-bold uppercase">Live</span>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-4">
        {/* Simulated CCTV Image Placeholder */}
        <div className="w-full aspect-video bg-slate-800 rounded-lg border-2 border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
           {/* In a real hackathon, we would put a real image here. For now, a stylish placeholder */}
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
           
           <ImageIcon size={48} className="text-slate-600 mb-2 relative z-10" />
           <p className="text-slate-500 font-mono text-sm relative z-10">Concourse 4_CAM_02.raw</p>
           
           {/* Scanning effect line */}
           {isAnalyzing && (
             <motion.div 
               className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
               animate={{ y: [0, 200, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             />
           )}
        </div>

        <div className="mt-8 w-full max-w-md space-y-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              isAnalyzing 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing Crowd Vectors...
              </>
            ) : (
              <>
                <ScanEye /> Engage Vision-Language AI
              </>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-950/50 p-2 rounded-md border border-red-900">{error}</p>
          )}

          <p className="text-slate-500 text-xs text-center leading-relaxed">
            Clicking this will trigger the GenAI Vision Model (simulated) to analyze the current CCTV frame for contextual crowd reasoning.
          </p>
        </div>
      </div>
    </div>
  );
}
