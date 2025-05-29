
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AppProvider } from '@/components/core/AppProvider';
import '@/i18n';
import './index.css';
import '@/utils/mapboxPreload';

// Initialisation des métriques de performance
if (process.env.NODE_ENV === 'development') {
  console.log('LocaSimple - Mode développement activé');
  
  // Observer les métriques Web Vitals avec la nouvelle API
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log);
    onFID(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  }).catch(err => {
    console.warn('Web vitals non disponibles:', err);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
