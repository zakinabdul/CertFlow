import { Award, Sparkles, RefreshCw, HelpCircle, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  nameCount: number;
  onLoadSampleData: () => void;
  onResetAll: () => void;
  onOpenHelp: () => void;
}

export function Header({
  nameCount,
  onLoadSampleData,
  onResetAll,
  onOpenHelp
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <Award className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                CertiCraft Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Bulk Generator
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Client-side bulk certificate generator with auto-shrinking typography & live editor
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Load 200 Sample Dataset */}
          <button
            onClick={onLoadSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 transition-all shadow-sm active:scale-95"
            title="Load 200 sample names for instant testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Load 200</span> Sample Names
          </button>

          {/* Quick Reset */}
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
            title="Reset settings & loaded template"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Help button */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            title="User Guide & Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Loaded count badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Loaded:</span>
            <span className="font-semibold text-emerald-400">{nameCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
