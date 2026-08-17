import { create } from 'zustand';

import type { AppData, AppTheme, ITab } from '../types';
import { getAppData, saveAppData } from '../utils/storage-utils';

interface AppStoreState extends AppData {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setCurrentTabId: (id: number) => void;
  createTab: () => number;
  updateTab: (id: number, updatedTab: Partial<ITab>) => void;
  setTabs: (tabs: ITab[]) => void;
  deleteTab: (tabId: number) => void;
}

const getInitialTheme = (storedTheme?: AppTheme): AppTheme => {
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
};

const defaultAppData: AppData = {
  tabs: [
    {
      id: 0,
      title: 'Tab 1',
      elements: [],
      appState: {},
    },
  ],
  currentTabId: 0,
};

export const useAppStore = create<AppStoreState>()((set) => {
  const storedData = getAppData();
  const data = storedData || defaultAppData;
  const initialTheme = getInitialTheme(storedData?.theme);

  return {
    tabs: data.tabs,
    currentTabId: data.currentTabId,
    theme: initialTheme,

    setTheme: (theme: AppTheme) => {
      set((state) => {
        const newAppData: AppData = {
          tabs: state.tabs,
          currentTabId: state.currentTabId,
          theme,
        };
        saveAppData(newAppData);
        return { ...state, theme };
      });
    },

    toggleTheme: () => {
      set((state) => {
        const newTheme: AppTheme = state.theme === 'dark' ? 'light' : 'dark';
        const newAppData: AppData = {
          tabs: state.tabs,
          currentTabId: state.currentTabId,
          theme: newTheme,
        };
        saveAppData(newAppData);
        return { ...state, theme: newTheme };
      });
    },

    setCurrentTabId: (id: number) => {
      set((state) => {
        const newAppData: AppData = {
          tabs: state.tabs,
          currentTabId: id,
          theme: state.theme,
        };
        saveAppData(newAppData);
        return newAppData;
      });
    },

    createTab: () => {
      let newTabId: number = -1;
      set((state) => {
        const maxId =
          state.tabs.length > 0
            ? Math.max(...state.tabs.map((tab) => tab.id))
            : -1;
        newTabId = maxId + 1;

        const newTab: ITab = {
          id: newTabId,
          title: `Tab ${newTabId + 1}`,
          elements: [],
          appState: {},
        };
        const newAppData: AppData = {
          tabs: [...state.tabs, newTab],
          currentTabId: state.currentTabId,
          theme: state.theme,
        };
        saveAppData(newAppData);
        return newAppData;
      });
      return newTabId;
    },

    updateTab: (id: number, updatedTab: Partial<ITab>) => {
      set((state) => {
        const newTabs = state.tabs.map((tab) =>
          tab.id !== id ? tab : { ...tab, ...updatedTab },
        );
        const newAppData: AppData = {
          tabs: newTabs,
          currentTabId: state.currentTabId,
          theme: state.theme,
        };
        saveAppData(newAppData);
        return newAppData;
      });
    },

    setTabs: (tabs: ITab[]) => {
      set((state) => {
        const newAppData: AppData = {
          tabs,
          currentTabId: state.currentTabId,
          theme: state.theme,
        };
        saveAppData(newAppData);
        return newAppData;
      });
    },

    deleteTab: (tabId: number) => {
      set((state) => {
        if (state.tabs.length === 1) return state;

        const delTabIndex = state.tabs.findIndex((tab) => tab.id === tabId);
        const newTabs = [...state.tabs];
        newTabs.splice(delTabIndex, 1);

        const newCurrentTabId =
          delTabIndex > 0 ? newTabs[delTabIndex - 1].id : newTabs[0].id;

        const newAppData: AppData = {
          tabs: newTabs,
          currentTabId: newCurrentTabId,
          theme: state.theme,
        };
        saveAppData(newAppData);
        return newAppData;
      });
    },
  };
});
