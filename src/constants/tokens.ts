export const colors = {
  primary: '#C97B4A',
  pd: '#A85F30',
  pl: '#F5E6D8',
  sec: '#E8A598',
  acc: '#7A9E7E',
  dk: '#4A3728',
  bg: '#FAF6F0',
  sur: '#FFFFFF',
  bdr: '#EAE0D4',
  mu: '#9B8578',
  ok: '#5C8A5C',
  okB: '#EEF5EE',
  okT: '#3A6B3A',
  wa: '#D4A017',
  waB: '#FDF8E7',
  waT: '#8B6600',
  waBdr: '#E8D878',
  al: '#A52A2A',
  alB: '#FDEAEA',
  alT: '#7A1A1A',
  alBdr: '#F0B8B8',
} as const;

export const fonts = {
  heading: 'Fraunces',
  body: 'Nunito',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const AVATAR_COLORS = [
  { id: 'tc', hex: '#C97B4A' },
  { id: 'dr', hex: '#E8A598' },
  { id: 'sg', hex: '#7A9E7E' },
  { id: 'sb', hex: '#87AECB' },
  { id: 'lv', hex: '#B39DD6' },
  { id: 'ye', hex: '#E8C547' },
  { id: 'mn', hex: '#8EC4A7' },
  { id: 'pe', hex: '#F5C4A0' },
  { id: 'wb', hex: '#8B6D5C' },
  { id: 'co', hex: '#E8857A' },
] as const;

// Avatars illustrés extraits de la plaquette de design
export type AvatarCategory = 'mother' | 'father' | 'parent' | 'diverse' | 'baby' | 'child';

export const AVATAR_CATALOG: { id: string; category: AvatarCategory; label: string }[] = [
  // Mères
  { id: 'm1', category: 'mother', label: 'Mère 1' },
  { id: 'm2', category: 'mother', label: 'Mère 2' },
  { id: 'm3', category: 'mother', label: 'Mère 3' },
  { id: 'm4', category: 'mother', label: 'Mère 4' },
  { id: 'm5', category: 'mother', label: 'Mère 5' },
  { id: 'm6', category: 'mother', label: 'Mère 6' },
  // Pères
  { id: 'f1', category: 'father', label: 'Père 1' },
  { id: 'f2', category: 'father', label: 'Père 2' },
  { id: 'f3', category: 'father', label: 'Père 3' },
  { id: 'f4', category: 'father', label: 'Père 4' },
  { id: 'f5', category: 'father', label: 'Père 5' },
  { id: 'f6', category: 'father', label: 'Père 6' },
  // Parents non-binaires
  { id: 'p1', category: 'parent', label: 'Parent 1' },
  { id: 'p2', category: 'parent', label: 'Parent 2' },
  { id: 'p3', category: 'parent', label: 'Parent 3' },
  { id: 'p4', category: 'parent', label: 'Parent 4' },
  { id: 'p5', category: 'parent', label: 'Parent 5' },
  { id: 'p6', category: 'parent', label: 'Parent 6' },
  // Diversité
  { id: 'd1', category: 'diverse', label: 'Divers 1' },
  { id: 'd2', category: 'diverse', label: 'Divers 2' },
  { id: 'd3', category: 'diverse', label: 'Divers 3' },
  { id: 'd4', category: 'diverse', label: 'Divers 4' },
  { id: 'd5', category: 'diverse', label: 'Divers 5' },
  { id: 'd6', category: 'diverse', label: 'Divers 6' },
  // Bébés (0-3 ans)
  { id: 'b1', category: 'baby', label: 'Bébé 1' },
  { id: 'b2', category: 'baby', label: 'Bébé 2' },
  { id: 'b3', category: 'baby', label: 'Bébé 3' },
  { id: 'b4', category: 'baby', label: 'Bébé 4' },
  { id: 'b5', category: 'baby', label: 'Bébé 5' },
  { id: 'b6', category: 'baby', label: 'Bébé 6' },
  { id: 'b7', category: 'baby', label: 'Bébé 7' },
  { id: 'b8', category: 'baby', label: 'Bébé 8' },
  // Jeunes enfants (3-6 ans)
  { id: 'c1', category: 'child', label: 'Enfant 1' },
  { id: 'c2', category: 'child', label: 'Enfant 2' },
  { id: 'c3', category: 'child', label: 'Enfant 3' },
  { id: 'c4', category: 'child', label: 'Enfant 4' },
  { id: 'c5', category: 'child', label: 'Enfant 5' },
  { id: 'c6', category: 'child', label: 'Enfant 6' },
  { id: 'c7', category: 'child', label: 'Enfant 7' },
  { id: 'c8', category: 'child', label: 'Enfant 8' },
];

// Map id → require() pour React Native (les requires doivent être statiques)
export const AVATAR_IMAGES: Record<string, ReturnType<typeof require>> = {
  m1: require('../../assets/avatars/parent_m1.png'),
  m2: require('../../assets/avatars/parent_m2.png'),
  m3: require('../../assets/avatars/parent_m3.png'),
  m4: require('../../assets/avatars/parent_m4.png'),
  m5: require('../../assets/avatars/parent_m5.png'),
  m6: require('../../assets/avatars/parent_m6.png'),
  f1: require('../../assets/avatars/parent_f1.png'),
  f2: require('../../assets/avatars/parent_f2.png'),
  f3: require('../../assets/avatars/parent_f3.png'),
  f4: require('../../assets/avatars/parent_f4.png'),
  f5: require('../../assets/avatars/parent_f5.png'),
  f6: require('../../assets/avatars/parent_f6.png'),
  p1: require('../../assets/avatars/parent_p1.png'),
  p2: require('../../assets/avatars/parent_p2.png'),
  p3: require('../../assets/avatars/parent_p3.png'),
  p4: require('../../assets/avatars/parent_p4.png'),
  p5: require('../../assets/avatars/parent_p5.png'),
  p6: require('../../assets/avatars/parent_p6.png'),
  d1: require('../../assets/avatars/parent_d1.png'),
  d2: require('../../assets/avatars/parent_d2.png'),
  d3: require('../../assets/avatars/parent_d3.png'),
  d4: require('../../assets/avatars/parent_d4.png'),
  d5: require('../../assets/avatars/parent_d5.png'),
  d6: require('../../assets/avatars/parent_d6.png'),
  b1: require('../../assets/avatars/child_b1.png'),
  b2: require('../../assets/avatars/child_b2.png'),
  b3: require('../../assets/avatars/child_b3.png'),
  b4: require('../../assets/avatars/child_b4.png'),
  b5: require('../../assets/avatars/child_b5.png'),
  b6: require('../../assets/avatars/child_b6.png'),
  b7: require('../../assets/avatars/child_b7.png'),
  b8: require('../../assets/avatars/child_b8.png'),
  c1: require('../../assets/avatars/child_c1.png'),
  c2: require('../../assets/avatars/child_c2.png'),
  c3: require('../../assets/avatars/child_c3.png'),
  c4: require('../../assets/avatars/child_c4.png'),
  c5: require('../../assets/avatars/child_c5.png'),
  c6: require('../../assets/avatars/child_c6.png'),
  c7: require('../../assets/avatars/child_c7.png'),
  c8: require('../../assets/avatars/child_c8.png'),
};
