import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import type { CertificateItem, CertificateSettings, ExportOptions, RenderProgress } from '../types/certificate';
import { renderCertificateOnCanvas } from './canvasRenderer';

/**
 * Sanitizes filename string for file systems
 */
export function sanitizeFilename(name: string, pattern: string, index: number, total: number): string {
  const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
  const padLength = total.toString().length;
  const paddedIndex = (index + 1).toString().padStart(padLength, '0');

  let result = pattern || 'certificate_{name}';
  result = result.replace(/{name}/g, sanitizedName);
  result = result.replace(/{index}/g, paddedIndex);
  result = result.replace(/{rawName}/g, name);

  return result || `certificate_${paddedIndex}_${sanitizedName}`;
}

/**
 * Executes async batch export for all certificates
 */
export async function exportCertificatesInBatch(
  templateImg: HTMLImageElement,
  items: CertificateItem[],
  settings: CertificateSettings,
  options: ExportOptions,
  onProgress: (progress: RenderProgress) => void
): Promise<void> {
  const total = items.length;
  if (total === 0) return;

  const offscreenCanvas = document.createElement('canvas');
  const width = templateImg.naturalWidth || templateImg.width || 926;
  const height = templateImg.naturalHeight || templateImg.height || 654;
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  if (options.format === 'pdf-single') {
    // Multi-page PDF Export
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    });

    for (let i = 0; i < total; i++) {
      const item = items[i];
      onProgress({
        current: i + 1,
        total,
        statusText: `Rendering certificate ${i + 1} of ${total} (${item.displayName})...`,
        isCompleted: false
      });

      await renderCertificateOnCanvas(offscreenCanvas, templateImg, item.displayName, settings, item.override);

      const imgData = offscreenCanvas.toDataURL('image/jpeg', options.quality || 0.92);

      if (i > 0) {
        pdf.addPage([width, height], width > height ? 'landscape' : 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

      // Yield control briefly to avoid locking UI thread
      if (i % 5 === 0) {
        await new Promise((r) => setTimeout(r, 10));
      }
    }

    onProgress({
      current: total,
      total,
      statusText: 'Saving PDF file...',
      isCompleted: false
    });

    pdf.save(`certificates_bundle_${total}_names.pdf`);
  } else {
    // PNG or JPEG ZIP Package Export
    const zip = new JSZip();
    const isJpeg = options.format === 'jpeg-zip';
    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const extension = isJpeg ? '.jpg' : '.png';

    for (let i = 0; i < total; i++) {
      const item = items[i];
      onProgress({
        current: i + 1,
        total,
        statusText: `Rendering certificate ${i + 1} of ${total} (${item.displayName})...`,
        isCompleted: false
      });

      await renderCertificateOnCanvas(offscreenCanvas, templateImg, item.displayName, settings, item.override);

      const filename = sanitizeFilename(item.displayName, options.filenamePattern, i, total) + extension;

      const blob = await new Promise<Blob | null>((resolve) => {
        offscreenCanvas.toBlob((b) => resolve(b), mimeType, options.quality || 0.92);
      });

      if (blob) {
        zip.file(filename, blob);
      }

      // Non-blocking UI tick
      if (i % 5 === 0) {
        await new Promise((r) => setTimeout(r, 10));
      }
    }

    onProgress({
      current: total,
      total,
      statusText: 'Compressing into ZIP archive...',
      isCompleted: false
    });

    const content = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' }, (metadata) => {
      onProgress({
        current: total,
        total,
        statusText: `Compressing ZIP: ${Math.round(metadata.percent)}%`,
        isCompleted: false
      });
    });

    // Ensure proper Blob MIME type for ZIP
    const zipBlob = content.type ? content : new Blob([content], { type: 'application/zip' });
    const zipUrl = URL.createObjectURL(zipBlob);
    
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `certificates_${total}_items.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Delay object URL revocation so browser can complete download with proper filename & .zip extension
    setTimeout(() => {
      URL.revokeObjectURL(zipUrl);
    }, 250);
  }

  // Final progress completion notification
  onProgress({
    current: total,
    total,
    statusText: 'Completed successfully!',
    isCompleted: true
  });

  // Confetti effect
  try {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (err) {
    // Ignore confetti errors if blocked
  }
}
