
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import checker from "vite-plugin-checker";

// On surveille uniquement src pour éviter EMFILE
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true
    },
    // On ignore tout sauf src (c’est lui qu’on édite et qui importe tout)
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
    include: ['react-map-gl', 'mapbox-gl', '@mapbox/mapbox-sdk'],
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
          warning.code === 'CIRCULAR_DEPENDENCY'
        ) {
          return;
        }
        defaultHandler(warning);
      },
      output: {
        manualChunks: {
          'mapbox-vendor': ['mapbox-gl', 'react-map-gl', '@mapbox/mapbox-sdk'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-select'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    global: 'globalThis',
    __DEV__: mode === 'development'
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
