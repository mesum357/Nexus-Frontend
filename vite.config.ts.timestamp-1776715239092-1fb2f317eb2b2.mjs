// vite.config.ts
import { defineConfig } from "file:///D:/c/Pakistan%20Online/Nexus-Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/c/Pakistan%20Online/Nexus-Frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///D:/c/Pakistan%20Online/Nexus-Frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\c\\Pakistan Online\\Nexus-Frontend";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
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
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-popover"]
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjXFxcXFBha2lzdGFuIE9ubGluZVxcXFxOZXh1cy1Gcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY1xcXFxQYWtpc3RhbiBPbmxpbmVcXFxcTmV4dXMtRnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2MvUGFraXN0YW4lMjBPbmxpbmUvTmV4dXMtRnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbi8vIGltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnOyAvLyBUZW1wb3JhcmlseSBkaXNhYmxlZCBmb3IgZGVwbG95bWVudFxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IHByb2Nlc3MuZW52LlBPUlQgfHwgODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICAvLyBUZW1wb3JhcmlseSBkaXNhYmxlZCBQV0EgcGx1Z2luIGZvciBkZXBsb3ltZW50XG4gICAgLy8gVml0ZVBXQSh7XG4gICAgLy8gICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAvLyAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5pY28nLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnLCAnbWFza2VkLWljb24uc3ZnJ10sXG4gICAgLy8gICBtYW5pZmVzdDoge1xuICAgIC8vICAgICBuYW1lOiAnRSBEdW5peWEnLFxuICAgIC8vICAgICBzaG9ydF9uYW1lOiAnRSBEdW5peWEnLFxuICAgIC8vICAgICBkZXNjcmlwdGlvbjogXCJQYWtpc3RhbidzIHByZW1pZXIgbWFya2V0cGxhY2UgZm9yIHNob3BzLCBpbnN0aXR1dGVzLCBob3NwaXRhbHMsIGFuZCBwcm9kdWN0c1wiLFxuICAgIC8vICAgICB0aGVtZV9jb2xvcjogJyMyNTYzZWInLFxuICAgIC8vICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgLy8gICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAvLyAgICAgc2NvcGU6ICcvJyxcbiAgICAvLyAgICAgc3RhcnRfdXJsOiAnLycsXG4gICAgLy8gICAgIGljb25zOiBbXG4gICAgLy8gICAgICAge1xuICAgIC8vICAgICAgICAgc3JjOiAnaWNvbnMvaWNvbi0xOTJ4MTkyLnBuZycsXG4gICAgLy8gICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgIC8vICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICAgIHtcbiAgICAvLyAgICAgICAgIHNyYzogJ2ljb25zL2ljb24tNTEyeDUxMi5wbmcnLFxuICAgIC8vICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAvLyAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICBdXG4gICAgLy8gICB9LFxuICAgIC8vICAgd29ya2JveDoge1xuICAgIC8vICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmd9J10sXG4gICAgLy8gICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgLy8gICAgICAge1xuICAgIC8vICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuICAgIC8vICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgIC8vICAgICAgICAgb3B0aW9uczoge1xuICAgIC8vICAgICAgICAgICBjYWNoZU5hbWU6ICdnb29nbGUtZm9udHMtY2FjaGUnLFxuICAgIC8vICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgLy8gICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgLy8gICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1IC8vIDw9PSAzNjUgZGF5c1xuICAgIC8vICAgICAgICAgICB9LFxuICAgIC8vICAgICAgICAgICBjYWNoZUtleVdpbGxCZVVzZWQ6IGFzeW5jICh7IHJlcXVlc3QgfSkgPT4ge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnVybFxuICAgIC8vICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgICB7XG4gICAgLy8gICAgICAgICB1cmxQYXR0ZXJuOiAvXFwuKD86cG5nfGpwZ3xqcGVnfHN2Z3xnaWYpJC8sXG4gICAgLy8gICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgLy8gICAgICAgICBvcHRpb25zOiB7XG4gICAgLy8gICAgICAgICAgIGNhY2hlTmFtZTogJ2ltYWdlcycsXG4gICAgLy8gICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAvLyAgICAgICAgICAgICBtYXhFbnRyaWVzOiA2MCxcbiAgICAvLyAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAzMCAqIDI0ICogNjAgKiA2MCAvLyAzMCBEYXlzXG4gICAgLy8gICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIF1cbiAgICAvLyAgIH1cbiAgICAvLyB9KVxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgc291cmNlbWFwOiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgdWk6IFsnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JywgJ0ByYWRpeC11aS9yZWFjdC1wb3BvdmVyJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFTLFNBQVMsb0JBQW9CO0FBQ2xVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTSxRQUFRLElBQUksUUFBUTtBQUFBLEVBQzVCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQTBENUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxXQUFXLFNBQVM7QUFBQSxJQUNwQixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDN0IsSUFBSSxDQUFDLDBCQUEwQiwwQkFBMEIseUJBQXlCO0FBQUEsUUFDcEY7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
