import { Excalidraw } from '@excalidraw/excalidraw';
import type { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types';
import { useCallback, useEffect } from 'react';

import TabBar from './components/TabBar';
import { useAppStore } from './store';
import { useExcalidrawFilesStore } from './store/excalidrawFiles';

function App() {
  const { tabs, currentTabId, updateTab, theme } = useAppStore();
  const { setFiles, getFiles } = useExcalidrawFilesStore();

  const currentTab = tabs.find((t) => t.id === currentTabId) || tabs[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleOnChange = useCallback(
    (
      elements: readonly OrderedExcalidrawElement[],
      state: AppState,
      files: BinaryFiles,
    ) => {
      updateTab(currentTabId, {
        elements,
        appState: {
          viewBackgroundColor: state.viewBackgroundColor,
          zoom: state.zoom,
          scrollX: state.scrollX,
          scrollY: state.scrollY,
        },
      });
      setFiles(files);
    },
    [currentTabId, updateTab, setFiles],
  );

  return (
    <>
      <TabBar />
      <Excalidraw
        key={currentTabId}
        theme={theme}
        onChange={handleOnChange}
        initialData={async () => ({
          elements: currentTab.elements,
          appState: {
            ...currentTab.appState,
            theme,
          },
          files: await getFiles(),
        })}
      />
    </>
  );
}

export default App;


