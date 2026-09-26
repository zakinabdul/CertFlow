import type { FontOption } from '../types/certificate';

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'Alex Brush',
    name: 'Alex Brush (Classic Script)',
    category: 'script',
    preview: 'Alex Brush',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Dancing Script',
    name: 'Dancing Script',
    category: 'script',
    preview: 'Dancing Script',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Great Vibes',
    name: 'Great Vibes',
    category: 'script',
    preview: 'Great Vibes',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Satisfy',
    name: 'Satisfy',
    category: 'script',
    preview: 'Satisfy',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Pacifico',
    name: 'Pacifico',
    category: 'script',
    preview: 'Pacifico',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Pinyon Script',
    name: 'Pinyon Script',
    category: 'script',
    preview: 'Pinyon Script',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Sacramento',
    name: 'Sacramento',
    category: 'script',
    preview: 'Sacramento',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Parisienne',
    name: 'Parisienne',
    category: 'script',
    preview: 'Parisienne',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Allura',
    name: 'Allura',
    category: 'script',
    preview: 'Allura',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Cinzel',
    name: 'Cinzel (Serif Caps)',
    category: 'serif',
    preview: 'Cinzel',
    sampleName: 'ANSIL HASHIM'
  },
  {
    id: 'Montserrat',
    name: 'Montserrat (Modern Sans)',
    category: 'sans-serif',
    preview: 'Montserrat',
    sampleName: 'ANSIL HASHIM'
  },
  {
    id: 'Playfair Display',
    name: 'Playfair Display (Serif)',
    category: 'serif',
    preview: 'Playfair Display',
    sampleName: 'Ansil Hashim'
  },
  {
    id: 'Cormorant Garamond',
    name: 'Cormorant Garamond',
    category: 'serif',
    preview: 'Cormorant Garamond',
    sampleName: 'Ansil Hashim'
  }
];

export const DEFAULT_SETTINGS = {
  fontFamily: 'Alex Brush',
  fontSize: 54,
  minFontSize: 24,
  color: '#0f172a', // Deep slate navy
  xOffset: 463, // 926 / 2
  yOffset: 280, // ~y=280px reference
  maxWidth: 580,
  textTransform: 'none' as const,
  fontWeight: '400',
  fontStyle: 'normal' as const,
  letterSpacing: 0,
  textAlign: 'center' as const,
  multiLine: false,
  lineHeight: 1.2,
  shadowEnabled: false,
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowBlur: 4,
  shadowOffsetY: 2,
  strokeEnabled: false,
  strokeColor: '#000000',
  strokeWidth: 1
};
