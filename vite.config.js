import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // מוודא שהנתיבים יעבדו גם אם GitHub מגיש מתיקייה פנימית
  base: '/saban-pwa/', 
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true, // מאפשר לראות שגיאות בקוד המקור בדפדפן (חיוני לדיבוג)
    manifest: true,
    rollupOptions: {
      output: {
        // וידוא שקבצי JS מקבלים שמות קבועים למניעת בעיות מטמון
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // הגדרות למניעת שגיאות מטמון בגרסאות פיתוח
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // טיפול בשגיאות ניווט ב-SPA
        navigateFallback: '/saban-pwa/index.html',
      },
      includeAssets: ['apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ח.סבן חומרי בנין',
        short_name: 'ח.סבן',
        description: 'קטלוג והזמנות לחומרי בנין',
        theme_color: '#14b8a6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
