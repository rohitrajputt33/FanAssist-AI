"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface StadiumMapProps {
  activeLocation?: string;
}

const sectors = [
  { id: 'gate-a', label: 'Gate A', x: 20, y: 20 },
  { id: 'gate-b', label: 'Gate B', x: 80, y: 20 },
  { id: 'gate-c', label: 'Gate C', x: 20, y: 80 },
  { id: 'gate-d', label: 'Gate D', x: 80, y: 80 },
  { id: 'field', label: 'Pitch', x: 50, y: 50 },
];

export default function StadiumMap({ activeLocation }: StadiumMapProps) {
  // Simple heuristic to match string to sector
  const activeSector = sectors.find(s => 
    activeLocation?.toLowerCase().includes(s.label.toLowerCase()) || 
    activeLocation?.toLowerCase().replace(/\s/g, '-') === s.id
  );

  return (
    <div className="relative w-full h-48 bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-transparent"></div>
      
      {/* Stadium Oval Graphic */}
      <div className="relative w-[90%] h-[80%] border-2 border-slate-600 rounded-[50px] flex items-center justify-center">
        {/* Pitch Graphic */}
        <div className="w-[60%] h-[40%] border border-slate-500 rounded-sm flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-slate-500"></div>
          <div className="absolute w-[1px] h-[40%] bg-slate-500"></div>
        </div>

        {/* Sectors */}
        {sectors.map((sector) => {
          const isActive = activeSector?.id === sector.id;
          return (
            <motion.div
              key={sector.id}
              className={`absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full font-bold text-[10px]
                ${isActive ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] z-10' : 'bg-slate-700 text-slate-400'}
              `}
              style={{
                left: `${sector.x}%`,
                top: `${sector.y}%`,
                width: isActive ? '36px' : '28px',
                height: isActive ? '36px' : '28px',
              }}
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {sector.label.split(' ')[1] || sector.label}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
