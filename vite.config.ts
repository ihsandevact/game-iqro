import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { synthesizeEdgeTTS } from './server/ttsHandler.js'

function edgeTtsVitePlugin() {
  return {
    name: 'edge-tts-server',
    configureServer(server: any) {
      server.middlewares.use('/api/tts', async (req: any, res: any) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }

        try {
          let text = '';
          let voice = 'id-ID-GadisNeural';
          let rate = '+5%';
          let pitch = '+4Hz';

          if (req.method === 'GET') {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            text = url.searchParams.get('text') || '';
            voice = url.searchParams.get('voice') || voice;
            rate = url.searchParams.get('rate') || rate;
            pitch = url.searchParams.get('pitch') || pitch;
          } else if (req.method === 'POST') {
            let bodyStr = '';
            for await (const chunk of req) {
              bodyStr += chunk;
            }
            const body = bodyStr ? JSON.parse(bodyStr) : {};
            text = body.text || '';
            voice = body.voice || voice;
            rate = body.rate || rate;
            pitch = body.pitch || pitch;
          }

          if (!text) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Text parameter is required' }));
            return;
          }

          const buffer = await synthesizeEdgeTTS({ text, voice, rate, pitch });

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', buffer.length);
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          res.statusCode = 200;
          res.end(buffer);
        } catch (err: any) {
          console.error('[Edge TTS Plugin Error]:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'TTS Synthesis error' }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    edgeTtsVitePlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Petualangan Iqro: Belajar Mengaji Ceria',
        short_name: 'Iqro Ceria',
        description: 'Game edukasi belajar membaca Iqro 1 sampai 6 untuk anak usia 3 tahun ke atas',
        theme_color: '#58CC02',
        background_color: '#F4F9F4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
  }
})
