/**
 * Application DOM initialization runtime profile.
 * Hooks into layout roots and attaches safe fallback handlers.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SettingsProvider } from './contexts/SettingsContext';
import { PaletteManager } from './utils/PaletteManager';
import App from './App';
import { ErrorBoundary } from './ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Target injection container element '#root' missing from active document context.");
}

PaletteManager.initialize();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
   <SettingsProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
   </SettingsProvider>
  </React.StrictMode>
);