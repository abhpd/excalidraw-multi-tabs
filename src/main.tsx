import '@excalidraw/excalidraw/index.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

const isGithubPages =
  window.location.origin === 'https://montejojorge.github.io' &&
  window.location.pathname.startsWith('/excalidraw-multi-tabs');

if (isGithubPages) {
  window.location.replace('https://excalidraw.jorgemon-lopez.workers.dev/');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
