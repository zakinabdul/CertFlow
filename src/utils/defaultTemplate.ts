/**
 * Generates an elegant default 926x654px certificate template as Data URL
 */
export function generateDefaultTemplateImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 926;
  canvas.height = 654;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const width = canvas.width;
  const height = canvas.height;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fafaf9');
  bgGrad.addColorStop(0.5, '#f5f5f4');
  bgGrad.addColorStop(1, '#e7e5e4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Border (Navy & Gold)
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#0f172a'; // Deep navy
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d97706'; // Gold
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Corner Ornaments (Gold Triangles/Accents)
  const drawCorner = (x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(35, 0);
    ctx.lineTo(0, 35);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(42, 0);
    ctx.lineTo(0, 42);
    ctx.stroke();
    ctx.restore();
  };

  drawCorner(32, 32, 0);
  drawCorner(width - 32, 32, 90);
  drawCorner(width - 32, height - 32, 180);
  drawCorner(32, height - 32, 270);

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = '600 14px Montserrat, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('OFFICIAL CERTIFICATION', width / 2, 85);
  ctx.letterSpacing = '0px';

  // Main Heading
  ctx.fillStyle = '#1e1b4b';
  ctx.font = '700 38px "Cinzel", "Playfair Display", serif';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 135);

  // Divider Line with Ribbon Accent
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, 155);
  ctx.lineTo(width / 2 + 120, 155);
  ctx.stroke();

  // Subtitle / Sub-heading
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('This certificate is proudly presented to', width / 2, 205);

  // Dotted underline for the name area around y=310px
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(180, 310);
  ctx.lineTo(width - 180, 310);
  ctx.stroke();
  ctx.setLineDash([]); // reset line dash

  // Description / Reason
  ctx.fillStyle = '#475569';
  ctx.font = '15px Montserrat, sans-serif';
  ctx.fillText('in recognition of outstanding performance, dedication, and exemplary achievement.', width / 2, 375);
  ctx.fillText('Issued by the Organization for Excellence.', width / 2, 400);

  // Signatures Section (Left & Right)
  const drawSignatureLine = (x: number, y: number, label: number | string, title: string) => {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 90, y);
    ctx.lineTo(x + 90, y);
    ctx.stroke();

    // Fake Cursive Signature
    ctx.fillStyle = '#1e293b';
    ctx.font = '24px "Alex Brush", cursive';
    ctx.fillText(label.toString(), x, y - 10);

    ctx.font = '600 12px Montserrat, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(title, x, y + 20);
  };

  drawSignatureLine(230, 520, 'Julian Vance', 'DIRECTOR OF EXCELLENCE');
  drawSignatureLine(width - 230, 520, 'Elena Rostova', 'CHAIRPERSON');

  // Gold Seal / Emblem in Center Bottom
  const sealX = width / 2;
  const sealY = 515;

  // Starburst circle
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12;
    const r = i % 2 === 0 ? 32 : 27;
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();

  // Inner Seal Circle
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.stroke();

  // Star inside seal
  ctx.fillStyle = '#fef3c7';
  ctx.font = '16px sans-serif';
  ctx.fillText('★', 0, 6);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
