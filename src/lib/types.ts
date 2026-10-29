export type PaletteKey = 'blue' | 'neutral' | 'green' | 'purple' | 'orange';

export interface ThemeColors {
  node: string;
  decision: string;
  text: string;
  line: string;
  labelBorder: string;
  accent: string;
  bg: string;
  canvas: string;
}

export interface Palette {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const PALETTES: Record<PaletteKey, Palette> = {
  blue: {
    name: '经典蓝 (Blue)',
    light: {
      node: '#e5f3ff',
      decision: '#f5faff',
      text: '#004f99',
      line: '#cedbe5',
      labelBorder: '#b6cee3',
      accent: '#0284c7',
      bg: '#ffffff',
      canvas: '#f8fafc',
    },
    dark: {
      node: '#00284d',
      decision: '#000e1a',
      text: '#99ceff',
      line: '#1a3e5f',
      labelBorder: '#1c456b',
      accent: '#38bdf8',
      bg: '#090d16',
      canvas: '#06090e',
    },
  },
  neutral: {
    name: '极简黑白 (Neutral)',
    light: {
      node: '#f3f4f6',
      decision: '#fafafa',
      text: '#27272a',
      line: '#d1d5db',
      labelBorder: '#e4e4e7',
      accent: '#18181b',
      bg: '#ffffff',
      canvas: '#f9fafb',
    },
    dark: {
      node: '#1c1c1f',
      decision: '#121214',
      text: '#e4e4e7',
      line: '#333338',
      labelBorder: '#3f3f46',
      accent: '#fafafa',
      bg: '#0f0f11',
      canvas: '#09090b',
    },
  },
  green: {
    name: '清新绿 (Green)',
    light: {
      node: '#d9f4e4',
      decision: '#edfaf2',
      text: '#00692a',
      line: '#c3dccd',
      labelBorder: '#a6d3b8',
      accent: '#059669',
      bg: '#ffffff',
      canvas: '#f8fdfa',
    },
    dark: {
      node: '#003716',
      decision: '#021c0c',
      text: '#8cdfad',
      line: '#1a4b2d',
      labelBorder: '#1f5e38',
      accent: '#34d399',
      bg: '#06170e',
      canvas: '#040f09',
    },
  },
  purple: {
    name: '雅致紫 (Purple)',
    light: {
      node: '#efe5fe',
      decision: '#f9f5fe',
      text: '#6b3ab4',
      line: '#d7cee5',
      labelBorder: '#c3b4dc',
      accent: '#8b5cf6',
      bg: '#ffffff',
      canvas: '#faf8fe',
    },
    dark: {
      node: '#2c184a',
      decision: '#170c26',
      text: '#ceb0fb',
      line: '#412f5c',
      labelBorder: '#533d75',
      accent: '#a78bfa',
      bg: '#140c21',
      canvas: '#0e0817',
    },
  },
  orange: {
    name: '暖阳橙 (Orange)',
    light: {
      node: '#ffe7d9',
      decision: '#fff5f0',
      text: '#6d2e0f',
      line: '#e5d0c3',
      labelBorder: '#dcb8a0',
      accent: '#ea580c',
      bg: '#ffffff',
      canvas: '#fffaf8',
    },
    dark: {
      node: '#4a2206',
      decision: '#281105',
      text: '#ffb790',
      line: '#5c381f',
      labelBorder: '#754728',
      accent: '#fb923c',
      bg: '#1c0f05',
      canvas: '#140a03',
    },
  },
};
