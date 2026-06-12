export type ColorStatus = 'ok' | 'watch' | 'alert';

export interface StoolColor {
  id: string;
  label: string;
  hex: string;
  status: ColorStatus;
  bordered?: boolean;
}

export interface UrineColor {
  id: string;
  label: string;
  hex: string;
  status: ColorStatus;
  bordered?: boolean;
}

export const STOOL_COLORS: StoolColor[] = [
  { id: 'ja', label: 'Jaune', hex: '#E8C547', status: 'ok' },
  { id: 'bj', label: 'Brun-jaune', hex: '#C99A3A', status: 'ok' },
  { id: 'br', label: 'Brun', hex: '#8B5E3C', status: 'ok' },
  { id: 'bf', label: 'Brun foncé', hex: '#5C3D2E', status: 'ok' },
  { id: 've', label: 'Vert', hex: '#5E8B5E', status: 'watch' },
  { id: 'or', label: 'Orange', hex: '#E07B3A', status: 'watch' },
  { id: 'ro', label: 'Rouge', hex: '#C84B4B', status: 'alert' },
  { id: 'no', label: 'Noir', hex: '#2A2220', status: 'alert' },
  { id: 'bl', label: 'Blanc/Gris', hex: '#C8C0B8', status: 'alert', bordered: true },
];

export const URINE_COLORS: UrineColor[] = [
  { id: 'in', label: 'Incolore', hex: '#F0EDE4', status: 'watch', bordered: true },
  { id: 'jp', label: 'Jaune pâle', hex: '#F5EEB0', status: 'ok' },
  { id: 'ja', label: 'Jaune', hex: '#E8D047', status: 'ok' },
  { id: 'jf', label: 'Jaune foncé', hex: '#D4A017', status: 'watch' },
  { id: 'am', label: 'Ambre', hex: '#B87333', status: 'alert' },
  { id: 'rg', label: 'Rose/Rouge', hex: '#E87878', status: 'alert' },
];
