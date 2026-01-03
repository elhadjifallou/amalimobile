import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { initIAP } from './iap'; 

// Initialiser IAP AVANT le rendu React
initIAP();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
