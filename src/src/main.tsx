import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
globalThis.Buffer = globalThis.Buffer || Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
