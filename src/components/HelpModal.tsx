import { X, Award, Upload, Users, Sliders, Download } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700/80 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">How to Use CertFlow Studio</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">1. Select or Upload Template</h4>
              <p className="text-slate-400 mt-0.5">
                The app comes loaded with a default 926×654px certificate template. You can drag and drop your own custom JPEG or PNG certificate background image anytime.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">2. Load Recipient Names</h4>
              <p className="text-slate-400 mt-0.5">
                Paste names (one per line) or upload a CSV / Excel spreadsheet. Click <strong>&quot;Load 200 Sample Names&quot;</strong> to instantly test large batch generation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">3. Interactive Dragging & Auto-Shrink</h4>
              <p className="text-slate-400 mt-0.5">
                Click and drag directly on the canvas preview to position the recipient name line. If a recipient&apos;s name is too long, the system automatically scales down the font size down to your minimum threshold.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">4. Bulk Export to ZIP or PDF</h4>
              <p className="text-slate-400 mt-0.5">
                Click <strong>Generate All & Download ZIP</strong>. High-resolution individual PNGs or a multi-page PDF bundle are created entirely inside your browser (100% private, no backend needed).
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
          >
            Got it, let&apos;s craft!
          </button>
        </div>
      </div>
    </div>
  );
};
