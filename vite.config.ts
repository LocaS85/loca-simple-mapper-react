import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import checker from "vite-plugin-checker";

// Configuration optimisée pour LocaSimple
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true
    },
    // Optimisation watch pour éviter EMFILE
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.env',
        '**/.output/**',
        '**/build/**',
        '**/.cache/**',
        '**/coverage/**',
        '!src/**'
      ]
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'development' && checker({
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
    include: [
      'react-map-gl', 
      'mapbox-gl', 
      '@mapbox/mapbox-sdk',
      '@mapbox/mapbox-gl-geocoder',
      'leaflet',
      'react-leaflet'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      }
    }
  },
  build: {
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.code === 'CIRCULAR_DEPENDENCY' ||
          warning.code === 'EVAL'
        ) {
          return;
        }
        defaultHandler(warning);
      },
      output: {
        manualChunks: {
          'mapbox-vendor': [
            'mapbox-gl', 
            'react-map-gl', 
            '@mapbox/mapbox-sdk',
            '@mapbox/mapbox-gl-geocoder'
          ],
          'leaflet-vendor': [
            'leaflet',
            'react-leaflet',
            'leaflet-geosearch'
          ],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-toast'
          ],
          'utils-vendor': [
            'lodash',
            'date-fns',
            'clsx',
            'zod'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    target: 'esnext'
  },
  define: {
    global: 'globalThis',
    __DEV__: mode === 'development',
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production')
  },
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'suspicious-comment': 'silent'
    },
    target: 'esnext'
  },
  // Configuration spécifique pour Vercel
  preview: {
    port: 8080,
    host: true
  }
}));
