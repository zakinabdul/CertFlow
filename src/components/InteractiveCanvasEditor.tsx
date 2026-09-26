import { useRef, useEffect, useState, useCallback } from 'react';
import type { CertificateSettings } from '../types/certificate';
import { renderCertificateOnCanvas, type RenderResult } from '../utils/canvasRenderer';
import { ZoomIn, ZoomOut, Maximize2, Move, AlertTriangle, Eye } from 'lucide-react';

interface InteractiveCanvasEditorProps {
  templateImg: HTMLImageElement | null;
  sampleName: string;
  settings: CertificateSettings;
  onSettingsChange: (updated: Partial<CertificateSettings>) => void;
}

export function InteractiveCanvasEditor({
  templateImg,
  sampleName,
  settings,
  onSettingsChange
}: InteractiveCanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizingMaxW, setIsResizingMaxW] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; initialXOffset: number; initialYOffset: number; initialMaxW: number }>({
    x: 0,
    y: 0,
    initialXOffset: 0,
    initialYOffset: 0,
    initialMaxW: 0
  });

  const [renderInfo, setRenderInfo] = useState<RenderResult>({
    effectiveFontSize: settings.fontSize,
    lines: [],
    isOverflowing: false
  });

  // Re-render canvas whenever template, settings, or sample name changes
  const redrawCanvas = useCallback(async () => {
    if (!canvasRef.current || !templateImg) return;
    try {
      const res = await renderCertificateOnCanvas(
        canvasRef.current,
        templateImg,
        sampleName || 'Ansil Hashim',
        settings
      );
      setRenderInfo(res);
    } catch (err) {
      console.error('Error drawing canvas:', err);
    }
  }, [templateImg, sampleName, settings]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Canvas coordinate converter from screen event
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x: Math.round(x), y: Math.round(y) };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const { x, y } = getCanvasCoordinates(e);

    // Check if clicking resize handle near bounding box boundary
    const isNearWidthEdge = Math.abs(x - (settings.xOffset + settings.maxWidth / 2)) < 25;
    
    if (isNearWidthEdge) {
      setIsResizingMaxW(true);
    } else {
      setIsDragging(true);
    }

    setDragStart({
      x,
      y,
      initialXOffset: settings.xOffset,
      initialYOffset: settings.yOffset,
      initialMaxW: settings.maxWidth
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging && !isResizingMaxW) return;
      if (!canvasRef.current) return;

      const { x, y } = getCanvasCoordinates(e);
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      if (isDragging) {
        onSettingsChange({
          xOffset: Math.max(0, Math.min(canvasRef.current.width, dragStart.initialXOffset + deltaX)),
          yOffset: Math.max(0, Math.min(canvasRef.current.height, dragStart.initialYOffset + deltaY))
        });
      } else if (isResizingMaxW) {
        const newMaxW = Math.max(100, Math.min(canvasRef.current.width, dragStart.initialMaxW + deltaX * 2));
        onSettingsChange({ maxWidth: newMaxW });
      }
    },
    [isDragging, isResizingMaxW, dragStart, onSettingsChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizingMaxW(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizingMaxW) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizingMaxW, handleMouseMove, handleMouseUp]);

  // Center alignment snapping check
  const isNearCenterX = Math.abs(settings.xOffset - (templateImg?.naturalWidth || 926) / 2) < 4;

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-3 relative overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Interactive Template Editor</h3>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono">
            (Click & drag text directly on canvas to reposition)
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-amber-400 text-[11px] w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1.0)}
            className="p-1 text-slate-400 hover:text-white transition-colors ml-1 border-l border-slate-800"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Auto-shrink notification badge */}
      {renderInfo.effectiveFontSize < settings.fontSize && (
        <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Auto-fit active: Font size reduced from <strong>{settings.fontSize}px</strong> down to{' '}
            <strong>{renderInfo.effectiveFontSize}px</strong> to fit inside max safe width ({settings.maxWidth}px).
          </span>
        </div>
      )}

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-full overflow-auto flex items-center justify-center p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 bg-grid-pattern min-h-[380px]"
      >
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="relative transition-transform duration-100 ease-out shadow-2xl rounded-lg overflow-hidden select-none cursor-crosshair"
          onMouseDown={handleMouseDown}
        >
          {/* Main HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            className="block max-w-full h-auto bg-slate-900 border border-slate-700/50 rounded-lg shadow-xl"
          />

          {/* Interactive Bounding Box & Drag Overlay */}
          {canvasRef.current && (
            <div
              style={{
                position: 'absolute',
                left: `${(settings.xOffset - settings.maxWidth / 2) / (canvasRef.current.width / 100)}%`,
                top: `${(settings.yOffset - renderInfo.effectiveFontSize) / (canvasRef.current.height / 100)}%`,
                width: `${settings.maxWidth / (canvasRef.current.width / 100)}%`,
                height: `${(renderInfo.effectiveFontSize * 1.4) / (canvasRef.current.height / 100)}%`
              }}
              className={`pointer-events-none border-2 border-dashed rounded transition-colors ${
                isDragging || isResizingMaxW
                  ? 'border-amber-400 bg-amber-400/15'
                  : 'border-amber-500/60 hover:border-amber-400 bg-amber-500/5'
              }`}
            >
              {/* Drag Icon Indicator */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg pointer-events-none">
                <Move className="w-2.5 h-2.5" />
                <span>Drag Position (Y: {settings.yOffset}px)</span>
              </div>

              {/* Resize Handle Right */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-full cursor-ew-resize pointer-events-auto shadow-md"
                title="Drag to resize safe width boundary"
              />
            </div>
          )}

          {/* Center alignment guide line */}
          {isNearCenterX && canvasRef.current && (
            <div
              style={{
                position: 'absolute',
                left: `${(settings.xOffset / canvasRef.current.width) * 100}%`,
                top: 0,
                bottom: 0,
                width: '1px'
              }}
              className="bg-emerald-400 pointer-events-none shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            >
              <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1 rounded">
                CENTERED
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
