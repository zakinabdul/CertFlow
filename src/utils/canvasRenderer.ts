import type { CertificateSettings, IndividualOverride } from '../types/certificate';

/**
 * Ensures Google Font is loaded into document before drawing on Canvas
 */
export async function ensureFontLoaded(fontFamily: string, fontSize: number = 40): Promise<boolean> {
  try {
    if ('fonts' in document) {
      const fontSpec = `400 ${fontSize}px "${fontFamily}"`;
      await document.fonts.load(fontSpec);
      return document.fonts.check(fontSpec);
    }
  } catch (err) {
    console.warn(`Font load check failed for ${fontFamily}:`, err);
  }
  return true;
}

/**
 * Formats name according to textTransform settings
 */
export function formatNameText(name: string, transform: CertificateSettings['textTransform']): string {
  if (!name) return '';
  const trimmed = name.trim();
  switch (transform) {
    case 'uppercase':
      return trimmed.toUpperCase();
    case 'lowercase':
      return trimmed.toLowerCase();
    case 'capitalize':
      return trimmed.replace(/\b\w/g, (char) => char.toUpperCase());
    case 'none':
    default:
      return trimmed;
  }
}

export interface RenderResult {
  effectiveFontSize: number;
  lines: string[];
  isOverflowing: boolean;
}

/**
 * Renders certificate onto canvas with auto-fitting name text
 */
export async function renderCertificateOnCanvas(
  canvas: HTMLCanvasElement,
  templateImg: HTMLImageElement,
  rawName: string,
  settings: CertificateSettings,
  override?: IndividualOverride
): Promise<RenderResult> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context 2D unavailable');
  }

  // Match canvas dimensions to template image
  const width = templateImg.naturalWidth || templateImg.width || 926;
  const height = templateImg.naturalHeight || templateImg.height || 654;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // Draw base template image
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(templateImg, 0, 0, width, height);

  const textToDraw = formatNameText(
    override?.customText !== undefined ? override.customText : rawName,
    settings.textTransform
  );

  if (!textToDraw) {
    return { effectiveFontSize: settings.fontSize, lines: [], isOverflowing: false };
  }

  // Ensure font is ready
  await ensureFontLoaded(settings.fontFamily, settings.fontSize);

  // Settings & Overrides
  let fontSize = override?.fontSize !== undefined ? override.fontSize : settings.fontSize;
  const minFontSize = settings.minFontSize || 16;
  const xOffset = override?.xOffset !== undefined ? override.xOffset : settings.xOffset;
  const yOffset = override?.yOffset !== undefined ? override.yOffset : settings.yOffset;
  const textColor = override?.color !== undefined ? override.color : settings.color;
  const maxWidth = settings.maxWidth || (width - 100);

  // Auto-shrink font size down to minFontSize
  ctx.save();
  
  let currentFontSpec = `${settings.fontStyle} ${settings.fontWeight} ${fontSize}px "${settings.fontFamily}", cursive, serif, sans-serif`;
  ctx.font = currentFontSpec;
  
  let textWidth = ctx.measureText(textToDraw).width;

  // Step down font size 1px at a time if name exceeds maxWidth
  while (textWidth > maxWidth && fontSize > minFontSize) {
    fontSize -= 1;
    currentFontSpec = `${settings.fontStyle} ${settings.fontWeight} ${fontSize}px "${settings.fontFamily}", cursive, serif, sans-serif`;
    ctx.font = currentFontSpec;
    textWidth = ctx.measureText(textToDraw).width;
  }

  let lines: string[] = [textToDraw];
  let isOverflowing = textWidth > maxWidth;

  // Multi-line wrap fallback if still overflowing and multiLine is enabled
  if (isOverflowing && settings.multiLine) {
    const words = textToDraw.split(' ');
    if (words.length > 1) {
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ');
      const line2 = words.slice(mid).join(' ');
      lines = [line1, line2];
      isOverflowing = false;
    }
  }

  // Canvas context styling for text render
  ctx.font = `${settings.fontStyle} ${settings.fontWeight} ${fontSize}px "${settings.fontFamily}", cursive, serif, sans-serif`;
  ctx.textAlign = settings.textAlign;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = textColor;

  // Shadow styling
  if (settings.shadowEnabled) {
    ctx.shadowColor = settings.shadowColor;
    ctx.shadowBlur = settings.shadowBlur;
    ctx.shadowOffsetY = settings.shadowOffsetY;
    ctx.shadowOffsetX = 0;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = 0;
  }

  // Stroke styling
  if (settings.strokeEnabled) {
    ctx.strokeStyle = settings.strokeColor;
    ctx.lineWidth = settings.strokeWidth;
  }

  // Draw line(s)
  const totalLines = lines.length;
  const fontLineHeight = fontSize * (settings.lineHeight || 1.2);
  const startY = totalLines === 1 
    ? yOffset 
    : yOffset - ((totalLines - 1) * fontLineHeight) / 2;

  lines.forEach((lineText, idx) => {
    const lineY = startY + idx * fontLineHeight;
    
    if (settings.strokeEnabled) {
      ctx.strokeText(lineText, xOffset, lineY);
    }
    ctx.fillText(lineText, xOffset, lineY);
  });

  ctx.restore();

  return {
    effectiveFontSize: fontSize,
    lines,
    isOverflowing
  };
}
