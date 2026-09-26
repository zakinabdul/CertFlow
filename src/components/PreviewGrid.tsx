import { useState, useEffect, useRef } from 'react';
import type { CertificateItem, CertificateSettings } from '../types/certificate';
import { renderCertificateOnCanvas } from '../utils/canvasRenderer';
import { LayoutGrid, Search, Edit3, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PreviewGridProps {
  items: CertificateItem[];
  templateImg: HTMLImageElement | null;
  settings: CertificateSettings;
  onOpenOverride: (item: CertificateItem) => void;
}

function PreviewCard({
  item,
  templateImg,
  settings,
  onOpenOverride
}: {
  item: CertificateItem;
  templateImg: HTMLImageElement | null;
  settings: CertificateSettings;
  onOpenOverride: (item: CertificateItem) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effectiveSize, setEffectiveSize] = useState<number>(settings.fontSize);

  useEffect(() => {
    if (!canvasRef.current || !templateImg) return;
    renderCertificateOnCanvas(canvasRef.current, templateImg, item.displayName, settings, item.override).then((res) => {
      setEffectiveSize(res.effectiveFontSize);
    });
  }, [templateImg, item, settings]);

  const hasOverride = !!item.override && Object.keys(item.override).length > 0;

  return (
    <div className="group relative glass-panel rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500/60 transition-all shadow-lg flex flex-col">
      {/* Thumbnail Canvas */}
      <div className="relative w-full aspect-[926/654] bg-slate-950 flex items-center justify-center p-1 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-contain rounded" />

        {/* Override Badge */}
        {hasOverride && (
          <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold shadow flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Customized</span>
          </div>
        )}

        {/* Hover overlay edit trigger */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => onOpenOverride(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition-transform scale-95 group-hover:scale-100"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Certificate
          </button>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="truncate">
          <div className="text-xs font-semibold text-white truncate" title={item.displayName}>
            {item.displayName}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Size: <span className={effectiveSize < settings.fontSize ? 'text-amber-400 font-bold' : 'text-slate-300'}>{effectiveSize}px</span>
            {effectiveSize < settings.fontSize && ' (Auto-fit)'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenOverride(item)}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors shrink-0"
          title="Customize certificate"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export function PreviewGrid({
  items,
  templateImg,
  settings,
  onOpenOverride
}: PreviewGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredItems = items.filter((item) =>
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, items.length]);

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4">
      {/* Grid Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Live Batch Previews</h3>
          <span className="text-xs text-slate-400 font-mono">
            ({filteredItems.length} of {items.length} certificates)
          </span>
        </div>

        {/* Search bar & Pagination */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 outline-none w-44 sm:w-56"
            />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-slate-300 text-[11px]">
                {currentPage}/{totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Container */}
      {visibleItems.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs font-mono">
          No matching certificates found for &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item) => (
            <PreviewCard
              key={item.id}
              item={item}
              templateImg={templateImg}
              settings={settings}
              onOpenOverride={onOpenOverride}
            />
          ))}
        </div>
      )}
    </div>
  );
};
