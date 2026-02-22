export const THEME_IDS = ['classic', 'premium'] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  description: string;
  previewColor: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Bold golden-yellow with clean white layout',
    previewColor: '#eab308',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Warm beige with elegant serif headings',
    previewColor: '#b8a590',
  },
];

export function isValidTheme(id: string): id is ThemeId {
  return THEME_IDS.includes(id as ThemeId);
}
