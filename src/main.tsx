
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Désactiver les logs de développement en production
if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
  console.debug = () => {};
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
