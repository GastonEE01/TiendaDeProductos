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
        name: 'Mi Marketplace',
        short_name: 'Marketplace',
        description: 'Tu tienda digital de confianza',
        theme_color: '#493f3f',
        background_color: '#853131',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/marketplace.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/marketplace.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})