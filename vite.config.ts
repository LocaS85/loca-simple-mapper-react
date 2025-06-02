
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
    hmr: {
      overlay: true
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    checker({ 
      typescript: true,
      overlay: {
        initialIsOpen: false,
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react-map-gl', 'mapbox-gl'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        defaultHandler(warning);
      }
    }
  }
}));
