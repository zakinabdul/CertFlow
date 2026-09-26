export interface CertificateSettings {
  fontFamily: string;
  fontSize: number;
  minFontSize: number;
  color: string;
  xOffset: number; // Center X coordinate
  yOffset: number; // Baseline Y coordinate
  maxWidth: number; // Safe width boundary
  textTransform: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;
  textAlign: 'center' | 'left' | 'right';
  multiLine: boolean;
  lineHeight: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetY: number;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
}

export interface IndividualOverride {
  customText?: string;
  fontSize?: number;
  xOffset?: number;
  yOffset?: number;
  color?: string;
}

export interface CertificateItem {
  id: string;
  originalName: string;
  displayName: string;
  override?: IndividualOverride;
}

export type ExportFormat = 'png-zip' | 'jpeg-zip' | 'pdf-single';

export interface ExportOptions {
  format: ExportFormat;
  filenamePattern: string; // e.g. "certificate_{name}" or "{index}_{name}_cert"
  quality: number; // 0.8 - 1.0
  pdfPageFormat: 'a4' | 'letter' | 'custom';
}

export interface FontOption {
  id: string;
  name: string;
  category: 'script' | 'serif' | 'sans-serif' | 'display';
  preview: string;
  sampleName: string;
}

export interface RenderProgress {
  current: number;
  total: number;
  statusText: string;
  isCompleted: boolean;
}
