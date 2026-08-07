import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit3, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 text-white p-6 select-none"
    >
      {/* Background ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      {/* Main animated icon container */}
      <motion.div
        initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
        animate={{ scale: [0.5, 1.1, 1], rotate: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 border border-purple-400/30">
          <Edit3 className="w-14 h-14 text-white drop-shadow-md" />
        </div>

        {/* Decorative badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 p-2 rounded-full shadow-lg"
        >
          <Sparkles className="w-4 h-4 fill-current" />
        </motion.div>
      </motion.div>

      {/* App Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-indigo-200"
      >
        NoteFlow
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-sm font-medium text-purple-200/80 mt-2 tracking-wide"
      >
        Material Design 3 Android Engine
      </motion.p>

      {/* Loading progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 140 }}
        transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
        className="h-1 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full mt-8 shadow-sm"
      />

      <div className="absolute bottom-8 text-xs text-purple-300/60 font-mono tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Hive DB Offline • API 35
      </div>
    </motion.div>
  );
};
