export const THEME_IDS = ['classic', 'teal', 'midnight-blue', 'dark-gold'] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  description: string;
  previewColor: string;
  mode: 'light' | 'dark';
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Golden-yellow with elegant serif headings',
    previewColor: '#eab308',
    mode: 'light',
  },
  {
    id: 'teal',
    name: 'Teal',
    description: 'Fresh teal accents with clean design',
    previewColor: '#14b8a6',
    mode: 'light',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep navy with cool blue accents',
    previewColor: '#3b82f6',
    mode: 'dark',
  },
  {
    id: 'dark-gold',
    name: 'Dark Gold',
    description: 'Dark charcoal with golden-yellow accents',
    previewColor: '#eab308',
    mode: 'dark',
  },
];

export function isValidTheme(id: string): id is ThemeId {
  return THEME_IDS.includes(id as ThemeId);
}
