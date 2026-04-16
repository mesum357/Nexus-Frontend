import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
// import { VitePWA } from 'vite-plugin-pwa'; // Temporarily disabled for deployment

const ANDROID_APK_PUBLIC_PATH = "/downloads/edunia-android.apk";
const ANDROID_APK_SOURCE = path.resolve(__dirname, "../Edunia-AndriodAPK.apk");
const ANDROID_APK_OUT = path.resolve(__dirname, "public/downloads/edunia-android.apk");

function androidApkDevPlugin(): Plugin {
  return {
    name: "android-apk-dev-download",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith(ANDROID_APK_PUBLIC_PATH)) return next();

        try {
          if (!fs.existsSync(ANDROID_APK_SOURCE)) {
            res.statusCode = 404;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end(
              `Missing APK at: ${ANDROID_APK_SOURCE}\nExpected repo file: Edunia-AndriodAPK.apk`,
            );
            return;
          }

          res.statusCode = 200;
          res.setHeader("content-type", "application/vnd.android.package-archive");
          res.setHeader(
            "content-disposition",
            `attachment; filename="Edunia-AndriodAPK.apk"`,
          );

          const stream = fs.createReadStream(ANDROID_APK_SOURCE);
          stream.on("error", () => {
            try {
              if (!res.headersSent) res.statusCode = 500;
              res.end("Failed to read APK");
            } catch {
              /* ignore */
            }
          });
          stream.pipe(res);
        } catch {
          res.statusCode = 500;
          res.setHeader("content-type", "text/plain; charset=utf-8");
          res.end("Failed to serve APK");
        }
      });
    },
  };
}

function copyAndroidApkToPublic(): Plugin {
  return {
    name: "copy-android-apk-to-public",
    apply: "build",
    buildStart() {
      try {
        if (!fs.existsSync(ANDROID_APK_SOURCE)) {
          // eslint-disable-next-line no-console
          console.warn(
            `[vite] APK not found at ${ANDROID_APK_SOURCE}. Skipping copy to public/downloads.`,
          );
          return;
        }
        fs.mkdirSync(path.dirname(ANDROID_APK_OUT), { recursive: true });
        fs.copyFileSync(ANDROID_APK_SOURCE, ANDROID_APK_OUT);
        // eslint-disable-next-line no-console
        console.log(`[vite] Copied Android APK -> ${ANDROID_APK_OUT}`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[vite] Failed to copy Android APK to public/downloads:", e);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 8080,
  },
  plugins: [
    react(),
    androidApkDevPlugin(),
    copyAndroidApkToPublic(),
    mode === 'development' && componentTagger(),
    // Temporarily disabled PWA plugin for deployment
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'E Duniya',
    //     short_name: 'E Duniya',
    //     description: "Pakistan's premier marketplace for shops, institutes, hospitals, and products",
    //     theme_color: '#2563eb',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     scope: '/',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: 'icons/icon-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'icons/icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'google-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
    //           },
    //           cacheKeyWillBeUsed: async ({ request }) => {
    //             return request.url
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'images',
    //           expiration: {
    //             maxEntries: 60,
    //             maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
    //           }
    //         }
    //       }
    //     ]
    //   }
    // })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-popover'],
        },
      },
    },
  },
}));
