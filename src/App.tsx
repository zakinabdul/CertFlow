import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CertificateItem, CertificateSettings, IndividualOverride } from './types/certificate';
import { generateDefaultTemplateImage } from './utils/defaultTemplate';
import { DEFAULT_SETTINGS } from './utils/fontList';
import { SAMPLE_NAMES } from './utils/sampleNames';
import { Header } from './components/Header';
import { TemplateUploader } from './components/TemplateUploader';
import { NamesInput } from './components/NamesInput';
import { StyleControls } from './components/StyleControls';
import { InteractiveCanvasEditor } from './components/InteractiveCanvasEditor';
import { PreviewGrid } from './components/PreviewGrid';
import { OverrideModal } from './components/OverrideModal';
import { ExportSection } from './components/ExportSection';
import { HelpModal } from './components/HelpModal';

export function App() {
  const [templateUrl, setTemplateUrl] = useState<string>('');
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [templateDimensions, setTemplateDimensions] = useState<{ width: number; height: number }>({
    width: 926,
    height: 654
  });
  const [isUsingDefault, setIsUsingDefault] = useState<boolean>(true);

  // Names State
  const [names, setNames] = useState<string[]>([]);
  const [rawText, setRawText] = useState<string>('');

  // Individual Overrides Map (id -> IndividualOverride)
  const [overrides, setOverrides] = useState<Record<string, IndividualOverride>>({});

  // Global Settings State
  const [settings, setSettings] = useState<CertificateSettings>(DEFAULT_SETTINGS);

  // Selected item for Override Modal
  const [overrideItem, setOverrideItem] = useState<CertificateItem | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Initialize Default Template & Initial Sample Data
  useEffect(() => {
    const defaultDataUrl = generateDefaultTemplateImage();
    setTemplateUrl(defaultDataUrl);

    const img = new Image();
    img.onload = () => {
      setTemplateImg(img);
      setTemplateDimensions({ width: img.naturalWidth || 926, height: img.naturalHeight || 654 });
    };
    img.src = defaultDataUrl;

    // Load initial sample names (Ansil Hashim + top recipients)
    const initialList = SAMPLE_NAMES.slice(0, 10);
    setNames(initialList);
    setRawText(initialList.join('\n'));
  }, []);

  // Update Settings handler
  const handleSettingsChange = useCallback((updated: Partial<CertificateSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  }, []);

  // Load Custom Template Image
  const handleTemplateSelected = (dataUrl: string, img: HTMLImageElement) => {
    setTemplateUrl(dataUrl);
    setTemplateImg(img);
    const w = img.naturalWidth || 926;
    const h = img.naturalHeight || 654;
    setTemplateDimensions({ width: w, height: h });
    setIsUsingDefault(false);

    // Adjust X offset to center
    setSettings((prev) => ({
      ...prev,
      xOffset: Math.round(w / 2),
      maxWidth: Math.round(w * 0.65)
    }));
  };

  // Reset Template back to Built-in Default
  const handleResetToDefault = () => {
    const defaultDataUrl = generateDefaultTemplateImage();
    setTemplateUrl(defaultDataUrl);
    const img = new Image();
    img.onload = () => {
      setTemplateImg(img);
      setTemplateDimensions({ width: 926, height: 654 });
    };
    img.src = defaultDataUrl;
    setIsUsingDefault(true);
    setSettings(DEFAULT_SETTINGS);
  };

  // Load 200 Sample Dataset
  const handleLoadSampleData = () => {
    setNames(SAMPLE_NAMES);
    setRawText(SAMPLE_NAMES.join('\n'));
  };

  // Names change handler
  const handleNamesChange = (newNames: string[], newRawText: string) => {
    setNames(newNames);
    setRawText(newRawText);
  };

  // Save Per-Certificate Override
  const handleSaveOverride = (itemId: string, overrideData?: IndividualOverride) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (!overrideData) {
        delete next[itemId];
      } else {
        next[itemId] = overrideData;
      }
      return next;
    });
  };

  // Reset All State
  const handleResetAll = () => {
    if (window.confirm('Reset all recipient names, styling controls, and template overrides?')) {
      handleResetToDefault();
      setNames([]);
      setRawText('');
      setOverrides({});
    }
  };

  // Derive Certificate Items
  const items: CertificateItem[] = useMemo(() => {
    return names.map((name, idx) => {
      const id = `item_${idx}_${name.replace(/[^a-zA-Z0-9]/g, '')}`;
      return {
        id,
        originalName: name,
        displayName: name,
        override: overrides[id]
      };
    });
  }, [names, overrides]);

  const sampleNameForEditor = names[0] || 'Ansil Hashim';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        nameCount={names.length}
        onLoadSampleData={handleLoadSampleData}
        onResetAll={handleResetAll}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Top Control Grid: Template, Names Input, Style Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Template Uploader & Names Input (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <TemplateUploader
              currentTemplateUrl={templateUrl}
              templateDimensions={templateDimensions}
              isUsingDefault={isUsingDefault}
              onTemplateSelected={handleTemplateSelected}
              onResetToDefault={handleResetToDefault}
            />

            <NamesInput
              names={names}
              rawText={rawText}
              onNamesChange={handleNamesChange}
              onLoadSampleData={handleLoadSampleData}
            />
          </div>

          {/* Right Column: Style Controls (7 cols) */}
          <div className="lg:col-span-7">
            <StyleControls
              settings={settings}
              onSettingsChange={handleSettingsChange}
              templateWidth={templateDimensions.width}
              templateHeight={templateDimensions.height}
            />
          </div>
        </div>

        {/* Center Interactive Canvas Editor */}
        <InteractiveCanvasEditor
          templateImg={templateImg}
          sampleName={sampleNameForEditor}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />

        {/* Live Batch Previews Gallery */}
        <PreviewGrid
          items={items}
          templateImg={templateImg}
          settings={settings}
          onOpenOverride={(item) => setOverrideItem(item)}
        />

        {/* Export & Download CTA Section */}
        <ExportSection templateImg={templateImg} items={items} settings={settings} />
      </main>

      {/* Per-Certificate Override Modal */}
      {overrideItem && (
        <OverrideModal
          item={overrideItem}
          templateImg={templateImg}
          settings={settings}
          onSaveOverride={handleSaveOverride}
          onClose={() => setOverrideItem(null)}
        />
      )}

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>CertiCraft Studio — 100% Private Client-Side Certificate Generation</span>
          <span className="font-mono text-slate-400">Vite + React + Canvas API + JSZip</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
