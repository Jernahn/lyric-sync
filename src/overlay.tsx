import React from 'react';
import ReactDOM from 'react-dom/client';
import { OverlayLyrics } from './components/OverlayLyrics';
import './index.css';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <OverlayLyrics />
    </React.StrictMode>,
  );
}
