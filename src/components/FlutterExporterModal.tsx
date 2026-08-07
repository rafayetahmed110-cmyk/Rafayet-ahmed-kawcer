import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterFiles';
import { downloadFlutterProjectZip } from '../utils/flutterExporter';
import { X, Download, Copy, Check, Code, Folder, FileCode, Sparkles } from 'lucide-react';

interface FlutterExporterModalProps {
  onClose: () => void;
}

export const FlutterExporterModal: React.FC<FlutterExporterModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadFlutterProjectZip();
    } catch (e) {
      console.error('Failed to export zip', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 select-none">
      <div className="w-full max-w-5xl h-full max-h-[92vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800">
        {/* Top Bar Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-none">Flutter Source Inspector</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  Ready to Build
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full Flutter + Riverpod + Hive Clean Architecture Codebase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Complete ZIP Button */}
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isExporting ? 'Packaging Zip...' : 'Download .ZIP Project'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body: Split View (File Tree + Code Viewer) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto max-h-48 md:max-h-none shrink-0 space-y-1">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-2 mb-2 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-purple-400" />
              <span>Project Tree ({FLUTTER_PROJECT_FILES.length} Files)</span>
            </div>

            {FLUTTER_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between gap-2 transition-all ${
                    isSelected
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950/90 overflow-hidden">
            {/* Code Header Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-purple-400 font-bold">{selectedFile.path}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px] font-sans">{selectedFile.description}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Text Window */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950 selection:bg-purple-900 selection:text-purple-100">
              <pre className="whitespace-pre wrap">{selectedFile.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer Build Command Banner */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Target: Android SDK 35 • Flutter 3.22+ • Hive DB • Riverpod</span>
          </div>

          <div className="font-mono text-slate-500 hidden sm:block">
            flutter pub get && flutter build apk --release
          </div>
        </div>
      </div>
    </div>
  );
};
