
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Element de fallback au cas où root n'est pas trouvé
const rootElement = document.getElementById("root") || document.createElement("div");

// Si l'élément a été créé, l'ajouter au body
if (!document.getElementById("root")) {
  rootElement.id = "root";
  document.body.appendChild(rootElement);
}

// Créer le root et render l'app
const root = createRoot(rootElement);
root.render(<App />);
