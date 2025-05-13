
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
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Erreur lors du rendu de l'application:", error);
    
    // Essai de récupération en cas d'erreur
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `
      <div style="padding: 20px; background-color: #f8d7da; color: #721c24; text-align: center; margin: 20px;">
        <h2>Erreur de rendu</h2>
        <p>Une erreur est survenue lors du chargement de l'application.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #721c24; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recharger la page
        </button>
      </div>
    `;
    
    // Vider et ajouter le message d'erreur
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }
    rootElement.appendChild(errorDiv);
  }
}
