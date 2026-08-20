import type { TabColor } from '../types';

export const TAB_COLORS = [
  'default',
  'blue',
  'emerald',
  'amber',
  'purple',
  'rose',
  'cyan',
] as const;

export const getRandomTabColor = (): TabColor => {
  return TAB_COLORS[Math.floor(Math.random() * TAB_COLORS.length)];
};
