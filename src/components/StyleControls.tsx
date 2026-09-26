import { useState } from 'react';
import type { CertificateSettings } from '../types/certificate';
import { FONT_OPTIONS } from '../utils/fontList';
import { Type, Sliders, Move, ChevronDown, ChevronUp, AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

interface StyleControlsProps {
  settings: CertificateSettings;
  onSettingsChange: (updated: Partial<CertificateSettings>) => void;
  templateWidth: number;
  templateHeight: number;
}

export function StyleControls({
  settings,
  onSettingsChange,
  templateWidth,
  templateHeight
}: StyleControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const presetColors = [
    '#0f172a', // Slate Navy
    '#1e1b4b', // Deep Indigo
    '#78350f', // Dark Amber
    '#064e3b', // Deep Emerald
    '#881337', // Crimson
    '#18181b', // Charcoal Black
    '#d97706', // Gold Accent
    '#ffffff'  // Pure White
  ];

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Type className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Typography & Position Controls</h3>
      </div>

      {/* Font Family Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Font Style</span>
          <span className="text-[11px] text-amber-400 font-mono">{settings.fontFamily}</span>
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 font-medium focus:border-amber-500 outline-none transition-all"
        >
          <optgroup label="Cursive & Script (Google Fonts)">
            {FONT_OPTIONS.filter((f) => f.category === 'script').map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Serif & Decorative">
            {FONT_OPTIONS.filter((f) => f.category === 'serif').map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Sans-Serif">
            {FONT_OPTIONS.filter((f) => f.category === 'sans-serif').map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Font Size & Min Font Size */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Base Font Size</span>
            <span className="font-mono text-amber-400 font-semibold">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min={18}
            max={120}
            value={settings.fontSize}
            onChange={(e) => onSettingsChange({ fontSize: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-300" title="Smallest allowed size when auto-shrinking long names">
            <span>Min Shrink Size</span>
            <span className="font-mono text-amber-400 font-semibold">{settings.minFontSize}px</span>
          </div>
          <input
            type="range"
            min={12}
            max={40}
            value={settings.minFontSize}
            onChange={(e) => onSettingsChange({ minFontSize: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Color Picker & Presets */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Text Color</span>
          <span className="text-[11px] font-mono text-slate-400">{settings.color}</span>
        </label>
        <div className="flex items-center gap-2">
          {/* Custom color input */}
          <input
            type="color"
            value={settings.color}
            onChange={(e) => onSettingsChange({ color: e.target.value })}
            className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer overflow-hidden p-0"
            title="Custom Hex Color"
          />

          {/* Preset Swatches */}
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-0.5">
            {presetColors.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onSettingsChange({ color: hex })}
                style={{ backgroundColor: hex }}
                className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${
                  settings.color.toLowerCase() === hex.toLowerCase()
                    ? 'border-amber-400 ring-2 ring-amber-500/50 scale-105'
                    : 'border-slate-700/80'
                }`}
                title={hex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Position Offsets (Vertical Y, Horizontal X, Max Width) */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-amber-400" />
            Position Offsets
          </span>
          <button
            type="button"
            onClick={() =>
              onSettingsChange({
                xOffset: Math.round(templateWidth / 2),
                yOffset: 280
              })
            }
            className="text-[11px] text-amber-400 hover:text-amber-300 font-mono"
          >
            Reset Center
          </button>
        </div>

        {/* Vertical Y Offset */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Vertical Position (Y)</span>
            <span className="font-mono text-slate-200">{settings.yOffset}px</span>
          </div>
          <input
            type="range"
            min={40}
            max={templateHeight - 40}
            value={settings.yOffset}
            onChange={(e) => onSettingsChange({ yOffset: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Max Safe Width Boundary */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Max Safe Width Boundary</span>
            <span className="font-mono text-slate-200">{settings.maxWidth}px</span>
          </div>
          <input
            type="range"
            min={200}
            max={templateWidth - 40}
            value={settings.maxWidth}
            onChange={(e) => onSettingsChange({ maxWidth: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Text Case & Alignment */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        {/* Case Transform */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Text Case</label>
          <select
            value={settings.textTransform}
            onChange={(e) => onSettingsChange({ textTransform: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="none">As Typed</option>
            <option value="capitalize">Title Case</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
          </select>
        </div>

        {/* Text Align */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Text Align</label>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => onSettingsChange({ textAlign: 'left' })}
              className={`flex-1 p-1 rounded text-center transition-colors ${
                settings.textAlign === 'left' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
              title="Left Align"
            >
              <AlignLeft className="w-3.5 h-3.5 mx-auto" />
            </button>
            <button
              type="button"
              onClick={() => onSettingsChange({ textAlign: 'center' })}
              className={`flex-1 p-1 rounded text-center transition-colors ${
                settings.textAlign === 'center' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
              title="Center Align"
            >
              <AlignCenter className="w-3.5 h-3.5 mx-auto" />
            </button>
            <button
              type="button"
              onClick={() => onSettingsChange({ textAlign: 'right' })}
              className={`flex-1 p-1 rounded text-center transition-colors ${
                settings.textAlign === 'right' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
              title="Right Align"
            >
              <AlignRight className="w-3.5 h-3.5 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Accordion Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Advanced (Shadow, Stroke, Multi-Line)
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-3 mt-2 border-t border-slate-800 text-xs">
            {/* Multi line checkbox */}
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.multiLine}
                onChange={(e) => onSettingsChange({ multiLine: e.target.checked })}
                className="rounded accent-amber-500"
              />
              <span>Allow breaking extremely long names onto 2 lines</span>
            </label>

            {/* Shadow Controls */}
            <div className="space-y-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer font-medium">
                <span>Text Drop Shadow</span>
                <input
                  type="checkbox"
                  checked={settings.shadowEnabled}
                  onChange={(e) => onSettingsChange({ shadowEnabled: e.target.checked })}
                  className="rounded accent-amber-500"
                />
              </label>

              {settings.shadowEnabled && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400">Blur: {settings.shadowBlur}px</span>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={settings.shadowBlur}
                      onChange={(e) => onSettingsChange({ shadowBlur: Number(e.target.value) })}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Color</span>
                    <input
                      type="color"
                      value={settings.shadowColor}
                      onChange={(e) => onSettingsChange({ shadowColor: e.target.value })}
                      className="w-full h-6 rounded bg-slate-900 border border-slate-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
