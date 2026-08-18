import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AppData, ITab } from '../types';

interface AppStoreState extends AppData {
  setCurrentTabId: (id: number) => void;
  createTab: () => number;
  updateTab: (id: number, updatedTab: Partial<ITab>) => void;
  setTabs: (tabs: ITab[]) => void;
  deleteTab: (tabId: number) => void;
}

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

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      tabs: defaultAppData.tabs,
      currentTabId: defaultAppData.currentTabId,

      setCurrentTabId: (id: number) => set({ currentTabId: id }),

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

          return { tabs: [...state.tabs, newTab] };
        });
        return newTabId;
      },

      updateTab: (id: number, updatedTab: Partial<ITab>) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id !== id ? tab : { ...tab, ...updatedTab },
          ),
        })),

      setTabs: (tabs: ITab[]) => set({ tabs }),

      deleteTab: (tabId: number) =>
        set((state) => {
          if (state.tabs.length === 1) return state;

          const delTabIndex = state.tabs.findIndex((tab) => tab.id === tabId);
          const newTabs = [...state.tabs];
          newTabs.splice(delTabIndex, 1);

          const newCurrentTabId =
            delTabIndex > 0 ? newTabs[delTabIndex - 1].id : newTabs[0].id;

          return {
            tabs: newTabs,
            currentTabId: newCurrentTabId,
          };
        }),
    }),
    {
      name: 'excalidraw-tabs-data',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const data = JSON.parse(str);
            return {
              state: {
                tabs: Array.isArray(data.tabs)
                  ? data.tabs
                  : defaultAppData.tabs,
                currentTabId:
                  typeof data.currentTabId === 'number'
                    ? data.currentTabId
                    : defaultAppData.currentTabId,
              },
              version: 0,
            };
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(
            name,
            JSON.stringify({
              tabs: value.state.tabs,
              currentTabId: value.state.currentTabId,
            }),
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
