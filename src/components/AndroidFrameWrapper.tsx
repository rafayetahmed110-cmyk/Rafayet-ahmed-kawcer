import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface AndroidFrameWrapperProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

export const AndroidFrameWrapper: React.FC<AndroidFrameWrapperProps> = ({ children, isDarkMode }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 overflow-x-hidden`}>
      {/* Frame Mode Toggle Bar */}
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between px-3 py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">NoteFlow Android Simulator</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[10px]">Material 3 • Android 15</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              isPhoneFrame
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone Frame</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              !isPhoneFrame
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Screen</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {isPhoneFrame ? (
        <div className="relative w-full max-w-[420px] h-[850px] max-h-[92vh] rounded-[48px] bg-slate-900 p-3 shadow-2xl border-[6px] border-slate-800 dark:border-slate-700 flex flex-col overflow-hidden ring-1 ring-slate-900/10">
          {/* Camera Punch Hole Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-40 flex items-center justify-center gap-2 px-2 shadow-inner">
            <div className="w-3 h-3 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            <div className="w-2 h-2 rounded-full bg-blue-950/80 ring-1 ring-blue-900/50" />
          </div>

          {/* Android Status Bar */}
          <div className={`w-full h-8 pt-1.5 px-6 flex items-center justify-between text-[11px] font-semibold tracking-tight z-30 select-none ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
            <span>{currentTime || '12:00'}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          </div>

          {/* Phone Screen Canvas */}
          <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900 rounded-[36px]">
            {children}
          </div>

          {/* Android Gesture Navigation Bar at bottom */}
          <div className={`w-full h-5 flex items-center justify-center z-30 select-none ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="w-32 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl h-[85vh] rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};
