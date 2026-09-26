import { useState } from 'react';
import type { CertificateItem, CertificateSettings, ExportFormat, ExportOptions, RenderProgress } from '../types/certificate';
import { exportCertificatesInBatch } from '../utils/zipExporter';
import { Download, Archive, FileText, Settings2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExportSectionProps {
  templateImg: HTMLImageElement | null;
  items: CertificateItem[];
  settings: CertificateSettings;
}

export function ExportSection({
  templateImg,
  items,
  settings
}: ExportSectionProps) {
  const [format, setFormat] = useState<ExportFormat>('png-zip');
  const [filenamePattern, setFilenamePattern] = useState<string>('certificate_{name}');
  const [quality, setQuality] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);

  const handleStartExport = async () => {
    if (!templateImg) {
      alert('Template image is still loading. Please try again in a moment.');
      return;
    }
    if (items.length === 0) {
      alert('Please add recipient names before generating certificates.');
      return;
    }

    setIsExporting(true);
    setProgress({
      current: 0,
      total: items.length,
      statusText: 'Preparing rendering engine...',
      isCompleted: false
    });

    const exportOptions: ExportOptions = {
      format,
      filenamePattern,
      quality,
      pdfPageFormat: 'custom'
    };

    try {
      await exportCertificatesInBatch(
        templateImg,
        items,
        settings,
        exportOptions,
        (currentProgress) => {
          setProgress(currentProgress);
        }
      );
    } catch (err) {
      alert('Export encountered an error: ' + (err as Error).message);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 1200);
    }
  };

  const progressPercent = progress ? Math.round((progress.current / progress.total) * 100) || 0 : 0;

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-4 border border-amber-500/30 shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Batch Export & Download</h3>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-full">
          {items.length} Certificates Ready
        </span>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Format Selector */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFormat('png-zip')}
              className={`py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                format === 'png-zip'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PNG ZIP
            </button>
            <button
              type="button"
              onClick={() => setFormat('jpeg-zip')}
              className={`py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                format === 'jpeg-zip'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JPEG ZIP
            </button>
            <button
              type="button"
              onClick={() => setFormat('pdf-single')}
              className={`py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                format === 'pdf-single'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PDF Bundle
            </button>
          </div>
        </div>

        {/* Filename Pattern */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Filename Pattern
          </label>
          <input
            type="text"
            value={filenamePattern}
            onChange={(e) => setFilenamePattern(e.target.value)}
            placeholder="certificate_{name}"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-slate-200 focus:border-amber-500 outline-none"
          />
          <p className="text-[10px] text-slate-400">
            Use <code className="text-amber-400">{'{name}'}</code> or <code className="text-amber-400">{'{index}'}</code> placeholders
          </p>
        </div>

        {/* Quality preset */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              Image Quality
            </span>
            <span className="font-mono text-amber-400">{Math.round(quality * 100)}%</span>
          </label>
          <input
            type="range"
            min={0.7}
            max={1.0}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Download CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isExporting || items.length === 0}
          onClick={handleStartExport}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>Generating {items.length} Certificates ({progressPercent}%)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
              <span>Generate All & Download {format === 'pdf-single' ? 'PDF' : 'ZIP'} ({items.length} Certificates)</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Modal */}
      {isExporting && progress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-amber-500/40 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              {progress.isCompleted ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
              ) : (
                <Loader2 className="w-7 h-7 animate-spin" />
              )}
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                {progress.isCompleted ? 'Export Complete!' : 'Processing Certificates...'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">{progress.statusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-200"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{progress.current} of {progress.total}</span>
                <span>{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
