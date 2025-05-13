
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// S'assurer que l'élément racine existe
const rootElement = document.getElementById("root");

if (!rootElement) {
  // Créer l'élément s'il n'existe pas
  const newRootElement = document.createElement("div");
  newRootElement.id = "root";
  document.body.appendChild(newRootElement);
  
  console.warn("L'élément root n'a pas été trouvé, un nouvel élément a été créé.");

  // Créer le root et render l'app
  const root = createRoot(newRootElement);
  root.render(<App />);
} else {
  // Utiliser l'élément existant
  const root = createRoot(rootElement);
  root.render(<App />);
}
