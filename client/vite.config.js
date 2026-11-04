import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'FitSync: Automated Workout & Cultural Diet Coach',
        short_name: 'FitSync',
        description: 'Workout and meal planner that adapts to you',
        theme_color: '#10B981',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/dashboard',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/assets\.lottiefiles\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'lottie-cache', expiration: { maxEntries: 20, maxAgeSeconds: 604800 } },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1/workouts/plan') || url.pathname.startsWith('/api/v1/diet/plan'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'plan-cache', expiration: { maxEntries: 5, maxAgeSeconds: 86400 } },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          query: ['@tanstack/react-query'],
          firebase: ['firebase/app', 'firebase/auth'],
        },
      },
    },
  },
});

