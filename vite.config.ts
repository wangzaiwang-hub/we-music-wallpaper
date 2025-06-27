/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from "vite-tsconfig-paths";

function getPlugins() {
  const plugins = [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Music Wallpaper',
        short_name: 'MusicPaper',
        description: '一个集壁纸与音乐播放于一体的桌面应用',
        theme_color: '#1a1a1a',
        icons: [
          {
            src: 'logo/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,mp4,jpg,webp,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|mp4|mp3|ico|woff|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'media-cache',
              expiration: {
                maxEntries: 100, // 最多缓存100个媒体文件
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
              },
            },
          },
        ],
      },
    }),
  ];
  return plugins;
}

export default defineConfig({
  plugins: getPlugins(),
});
