import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'tauri'
      ? []
      : [
          VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
              'nexus-shop-192.png',
              'nexus-shop-512.png',
              'nexus-shop-maskable-512.png',
            ],
            manifest: {
              name: 'NexusShop',
              short_name: 'NexusShop',
              description: 'Plataforma moderna de comercio y gestión en tiempo real',
              lang: 'es',
              theme_color: '#0f172a',
              background_color: '#0f172a',
              display: 'standalone',
              start_url: '/',
              icons: [
                {
                  src: '/nexus-shop-192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
                },
                {
                  src: '/nexus-shop-512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any',
                },
                {
                  src: '/nexus-shop-maskable-512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
                },
              ],
            },
          }),
        ]),
  ],
}))