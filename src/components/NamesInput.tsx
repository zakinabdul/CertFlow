import React, { useState, useRef } from 'react';
import { Users, FileSpreadsheet, Sparkles, Trash2, Filter, FileText } from 'lucide-react';
import { parseCSVFile, parseXLSXFile, sanitizeNamesList, type ParsedSpreadsheet } from '../utils/fileParsers';

interface NamesInputProps {
  names: string[];
  rawText: string;
  onNamesChange: (newNames: string[], rawText: string) => void;
  onLoadSampleData: () => void;
}

export function NamesInput({
  names,
  rawText,
  onNamesChange,
  onLoadSampleData
}: NamesInputProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [parsedSheet, setParsedSheet] = useState<ParsedSpreadsheet | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const sanitized = sanitizeNamesList(val);
    onNamesChange(sanitized, val);
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessingFile(true);
    setFileName(file.name);
    try {
      let result: ParsedSpreadsheet;
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await parseXLSXFile(file);
      } else {
        result = await parseCSVFile(file);
      }

      setParsedSheet(result);
      const chosenCol = result.suggestedColumn || result.columns[0] || '';
      setSelectedColumn(chosenCol);

      if (chosenCol && result.rows.length > 0) {
        const extractedNames = result.rows
          .map((row) => row[chosenCol]?.trim())
          .filter((n) => n && n.length > 0);
        
        onNamesChange(extractedNames, extractedNames.join('\n'));
      }
    } catch (err) {
      alert('Error parsing spreadsheet file: ' + (err as Error).message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleColumnChange = (colName: string) => {
    setSelectedColumn(colName);
    if (parsedSheet && colName) {
      const extractedNames = parsedSheet.rows
        .map((row) => row[colName]?.trim())
        .filter((n) => n && n.length > 0);

      onNamesChange(extractedNames, extractedNames.join('\n'));
    }
  };

  const handleRemoveDuplicates = () => {
    const deduped = sanitizeNamesList(rawText, true);
    onNamesChange(deduped, deduped.join('\n'));
  };

  const handleClearAll = () => {
    onNamesChange([], '');
    setParsedSheet(null);
    setFileName('');
  };

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Recipient Names</h3>
          <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {names.length} loaded
          </span>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              activeTab === 'paste'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3 h-3" />
            Paste
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3" />
            CSV / XLSX
          </button>
        </div>
      </div>

      {/* Tab 1: Paste Textarea */}
      {activeTab === 'paste' && (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={rawText}
              onChange={handleTextareaChange}
              placeholder="Paste recipient names here (one name per line)&#10;e.g.&#10;Ansil Hashim&#10;Sophia Rodriguez&#10;Alexander Bartholomew Montgomery"
              rows={6}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 transition-all resize-y"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>One name per line</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLoadSampleData}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Load 200 Sample Names
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Spreadsheet Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900 rounded-xl p-4 text-center transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .tsv, .xlsx, .xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <FileSpreadsheet className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-xs font-medium text-slate-200">
              {fileName ? fileName : 'Upload CSV or Excel (.xlsx) file'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click to browse or drop file here
            </p>
          </div>

          {isProcessingFile && (
            <div className="text-xs text-amber-400 text-center animate-pulse">
              Parsing spreadsheet...
            </div>
          )}

          {parsedSheet && parsedSheet.columns.length > 0 && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Select Name Column:</span>
                <span className="text-emerald-400 text-[11px] font-mono">
                  {parsedSheet.totalCount} rows detected
                </span>
              </div>
              <select
                value={selectedColumn}
                onChange={(e) => handleColumnChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
              >
                {parsedSheet.columns.map((col) => (
                  <option key={col} value={col}>
                    {col} {col === parsedSheet.suggestedColumn ? '(Auto-Detected)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      {names.length > 0 && (
        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-800/60">
          <button
            type="button"
            onClick={handleRemoveDuplicates}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Remove duplicate names"
          >
            <Filter className="w-3 h-3 text-slate-400" />
            Clean Duplicates
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1 text-rose-400/90 hover:text-rose-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
