
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    checker({ 
      typescript: true, 
      eslint: { 
        files: ['./src'], 
        extensions: ['.ts', '.tsx'] 
      } 
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    },
  },
  optimizeDeps: {
    include: ['react-map-gl'],
  },
}));
