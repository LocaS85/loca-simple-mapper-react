
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Create a function to handle the rendering
const renderApp = () => {
  try {
    if (!rootElement) {
      console.error("Root element not found!");
      return;
    }

    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Error rendering application:", error);
    
    // Show a fallback UI if rendering fails
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
          <h2 style="color: #e11d48;">Something went wrong</h2>
          <p>The application could not be loaded. Please try refreshing the page.</p>
          <button onclick="window.location.reload()" 
            style="margin-top: 16px; padding: 8px 16px; background-color: #2563eb; color: white; 
            border: none; border-radius: 4px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      `;
    }
  }
};

// Execute the render function
renderApp();
