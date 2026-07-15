"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, Volume2 } from 'lucide-react';

interface PAAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptEn: string;
  scriptEs: string;
}

/**
 * Public Address Announcement Modal.
 * Displays auto-generated bilingual (English/Spanish) PA announcement scripts
 * for multilingual assistance during stadium emergencies.
 *
 * @param {PAAnnouncementModalProps} props - Component properties.
 * @returns {React.ReactElement | null} The PAAnnouncementModal component.
 */
const PAAnnouncementModal: React.FC<PAAnnouncementModalProps> = React.memo(function PAAnnouncementModal({ isOpen, onClose, scriptEn, scriptEs }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center">
            <h2 id="modal-title" className="text-white text-lg font-bold flex items-center gap-2">
              <Megaphone size={20} aria-hidden="true" />
              Auto-Generated PA Announcement
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-md focus:ring-2 focus:ring-white"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                <Volume2 size={16} /> English Broadcast
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white font-medium leading-relaxed">
                &quot;{scriptEn}&quot;
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                <Volume2 size={16} /> Spanish Broadcast
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-white font-medium leading-relaxed">
                &quot;{scriptEs}&quot;
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors focus:ring-2 focus:ring-blue-500"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default PAAnnouncementModal;
