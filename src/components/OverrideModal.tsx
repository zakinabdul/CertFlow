import { useRef, useEffect, useState } from 'react';
import type { CertificateItem, CertificateSettings } from '../types/certificate';
import { renderCertificateOnCanvas } from '../utils/canvasRenderer';
import { X, Edit3, RotateCcw, Check } from 'lucide-react';

interface OverrideModalProps {
  item: CertificateItem | null;
  templateImg: HTMLImageElement | null;
  settings: CertificateSettings;
  onSaveOverride: (itemId: string, override: CertificateItem['override']) => void;
  onClose: () => void;
}

export function OverrideModal({
  item,
  templateImg,
  settings,
  onSaveOverride,
  onClose
}: OverrideModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [customText, setCustomText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(settings.fontSize);
  const [xOffset, setXOffset] = useState<number>(settings.xOffset);
  const [yOffset, setYOffset] = useState<number>(settings.yOffset);
  const [useCustomFontSize, setUseCustomFontSize] = useState<boolean>(false);
  const [useCustomPos, setUseCustomPos] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      setCustomText(item.override?.customText ?? item.displayName);
      if (item.override?.fontSize !== undefined) {
        setFontSize(item.override.fontSize);
        setUseCustomFontSize(true);
      } else {
        setFontSize(settings.fontSize);
        setUseCustomFontSize(false);
      }

      if (item.override?.xOffset !== undefined || item.override?.yOffset !== undefined) {
        setXOffset(item.override?.xOffset ?? settings.xOffset);
        setYOffset(item.override?.yOffset ?? settings.yOffset);
        setUseCustomPos(true);
      } else {
        setXOffset(settings.xOffset);
        setYOffset(settings.yOffset);
        setUseCustomPos(false);
      }
    }
  }, [item, settings]);

  // Redraw preview canvas inside modal
  useEffect(() => {
    if (!canvasRef.current || !templateImg || !item) return;
    const currentOverride = {
      customText: customText,
      fontSize: useCustomFontSize ? fontSize : undefined,
      xOffset: useCustomPos ? xOffset : undefined,
      yOffset: useCustomPos ? yOffset : undefined
    };

    renderCertificateOnCanvas(canvasRef.current, templateImg, item.displayName, settings, currentOverride);
  }, [templateImg, item, customText, fontSize, xOffset, yOffset, useCustomFontSize, useCustomPos, settings]);

  if (!item) return null;

  const handleSave = () => {
    const override = {
      customText: customText !== item.displayName ? customText : undefined,
      fontSize: useCustomFontSize ? fontSize : undefined,
      xOffset: useCustomPos ? xOffset : undefined,
      yOffset: useCustomPos ? yOffset : undefined
    };

    const hasAnyOverride =
      override.customText !== undefined ||
      override.fontSize !== undefined ||
      override.xOffset !== undefined ||
      override.yOffset !== undefined;

    onSaveOverride(item.id, hasAnyOverride ? override : undefined);
    onClose();
  };

  const handleReset = () => {
    setCustomText(item.displayName);
    setFontSize(settings.fontSize);
    setXOffset(settings.xOffset);
    setYOffset(settings.yOffset);
    setUseCustomFontSize(false);
    setUseCustomPos(false);
    onSaveOverride(item.id, undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Per-Certificate Override: <span className="text-amber-400 font-mono">{item.displayName}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Canvas Preview */}
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded border border-slate-800 shadow" />
        </div>

        {/* Override Form Controls */}
        <div className="space-y-3 text-xs">
          {/* Custom Name string */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Recipient Display Name</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 outline-none"
            />
          </div>

          {/* Custom Font Size Toggle & Slider */}
          <div className="space-y-1.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <label className="flex items-center justify-between text-slate-300 font-medium cursor-pointer">
              <span>Override Font Size for this certificate</span>
              <input
                type="checkbox"
                checked={useCustomFontSize}
                onChange={(e) => setUseCustomFontSize(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>

            {useCustomFontSize && (
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={14}
                  max={120}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="font-mono text-amber-400 font-semibold w-12 text-right">{fontSize}px</span>
              </div>
            )}
          </div>

          {/* Custom Position Toggle & Sliders */}
          <div className="space-y-1.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <label className="flex items-center justify-between text-slate-300 font-medium cursor-pointer">
              <span>Override Position (Y baseline)</span>
              <input
                type="checkbox"
                checked={useCustomPos}
                onChange={(e) => setUseCustomPos(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>

            {useCustomPos && (
              <div className="pt-2 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">Y Offset ({yOffset}px)</span>
                  <input
                    type="range"
                    min={40}
                    max={templateImg?.naturalHeight || 654}
                    value={yOffset}
                    onChange={(e) => setYOffset(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">X Center ({xOffset}px)</span>
                  <input
                    type="range"
                    min={40}
                    max={templateImg?.naturalWidth || 926}
                    value={xOffset}
                    onChange={(e) => setXOffset(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Global Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
