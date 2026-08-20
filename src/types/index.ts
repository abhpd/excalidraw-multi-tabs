import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { AppState } from '@excalidraw/excalidraw/types';

import { TAB_COLORS } from '../utils/colors';

export type AppTheme = 'light' | 'dark';

export type TabColor = (typeof TAB_COLORS)[number];

export interface ITab {
  id: number;
  title: string;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  color?: TabColor;
}

export interface AppData {
  tabs: ITab[];
  currentTabId: number;
  theme?: AppTheme;
}
