
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AppProvider } from '@/components/core/AppProvider';
import '@/i18n';
import './index.css';
import '@/utils/mapboxPreload';

// Initialisation des métriques de performance avec gestion d'erreurs améliorée
if (process.env.NODE_ENV === 'development') {
  console.log('LocaSimple - Mode développement activé');
  
  // Observer les métriques Web Vitals avec la nouvelle API (v4+)
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    try {
      onCLS(console.log);
      onFCP(console.log);
      onLCP(console.log);
      onTTFB(console.log);
      // onINP remplace onFID dans web-vitals v4+
      if (onINP) {
        onINP(console.log);
      }
    } catch (error) {
      console.warn('Erreur lors de l\'initialisation des métriques:', error);
    }
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
