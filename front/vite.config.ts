import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'NexusShop',
        short_name: 'NexusShop',
        description: 'Plataforma moderna de comercio y gestión en tiempo real',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/nexus-shop.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/nexus-shop.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})