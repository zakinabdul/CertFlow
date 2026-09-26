import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, RotateCcw, Check, Sparkles } from 'lucide-react';

interface TemplateUploaderProps {
  currentTemplateUrl: string;
  templateDimensions: { width: number; height: number };
  isUsingDefault: boolean;
  onTemplateSelected: (dataUrl: string, img: HTMLImageElement) => void;
  onResetToDefault: () => void;
}

export function TemplateUploader({
  currentTemplateUrl,
  templateDimensions,
  isUsingDefault,
  onTemplateSelected,
  onResetToDefault
}: TemplateUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid PNG or JPEG image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          onTemplateSelected(dataUrl, img);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Certificate Template</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          {templateDimensions.width} × {templateDimensions.height} px
        </span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-3 text-center transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-slate-700/80 hover:border-amber-500/50 bg-slate-900/60 hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        <div className="flex items-center gap-3">
          {/* Thumbnail preview */}
          {currentTemplateUrl && (
            <div className="relative w-16 h-12 rounded-md overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
              <img
                src={currentTemplateUrl}
                alt="Template Preview"
                className="w-full h-full object-cover"
              />
              {isUsingDefault && (
                <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300 drop-shadow" />
                </div>
              )}
            </div>
          )}

          <div className="flex-1 text-left">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200 group-hover:text-amber-300 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUsingDefault ? 'Upload Custom Template Image' : 'Change Template Image'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Drag & drop JPEG/PNG (reference: 926×654px)
            </p>
          </div>

          {!isUsingDefault && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onResetToDefault();
              }}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Reset to default reference template"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Default</span>
            </button>
          )}
        </div>
      </div>

      {isUsingDefault && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          <Check className="w-3 h-3" />
          <span>Active: Built-in 926×654px reference certificate template</span>
        </div>
      )}
    </div>
  );
};
