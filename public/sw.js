// E Duniya PWA Service Worker
const CACHE_NAME = 'nexus-pwa-v2';
const STATIC_CACHE_NAME = 'nexus-static-v2';
const DYNAMIC_CACHE_NAME = 'nexus-dynamic-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other critical assets here
];

// Routes that should work offline
const OFFLINE_ROUTES = [
  '/',
  '/marketplace',
  '/store',
  '/feed',
  '/auth'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
  
  // Force the service worker to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (unless specifically handled)
  if (url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // For navigation requests (page loads)
    if (request.mode === 'navigate') {
      return handleNavigationRequest(request);
    }
    
    // For API requests
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request);
    }
    
    // For static assets
    return handleStaticAssetRequest(request);
    
  } catch (error) {
    console.error('Service Worker: Fetch error', error);
    return handleOfflineFallback(request);
  }
}

async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return getOfflinePage();
  }
}

async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // For API requests, try network first
    const networkResponse = await fetch(request);
    
    // Don't cache authentication-related requests
    const authEndpoints = ['/login', '/register', '/logout', '/me', '/verify-email', '/resend-verification'];
    const isAuthRequest = authEndpoints.some(endpoint => url.pathname.includes(endpoint));
    
    // Cache successful GET responses (except auth requests)
    if (networkResponse.ok && request.method === 'GET' && !isAuthRequest) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache for GET requests (except auth requests)
    const authEndpoints = ['/login', '/register', '/logout', '/me', '/verify-email', '/resend-verification'];
    const isAuthRequest = authEndpoints.some(endpoint => url.pathname.includes(endpoint));
    
    if (request.method === 'GET' && !isAuthRequest) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // For authentication requests that fail, return a specific error
    if (isAuthRequest) {
      return new Response(
        JSON.stringify({ 
          error: 'Authentication unavailable offline', 
          offline: true,
          needsOnline: true 
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return error response for other failed API requests
    return new Response(
      JSON.stringify({ error: 'Network unavailable', offline: true }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleStaticAssetRequest(request) {
  // Try cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return handleOfflineFallback(request);
  }
}

async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For images, return a placeholder
  if (request.destination === 'image') {
    return getOfflineImage();
  }
  
  // For navigation, return offline page
  if (request.mode === 'navigate') {
    return getOfflinePage();
  }
  
  // For other requests, return a basic response
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

function getOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>E Duniya - Offline</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          min-height: 100vh;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .container {
          max-width: 400px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        h1 { margin-bottom: 20px; }
        p { margin-bottom: 30px; line-height: 1.5; }
        .retry-btn {
          background: white;
          color: #2563eb;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }
        .retry-btn:hover {
          background: #f3f4f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📱 You're Offline</h1>
        <p>Don't worry! E Duniya works offline too. Some features may be limited, but you can still browse cached content.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

function getOfflineImage() {
  // Return a simple placeholder SVG
  const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="#f3f4f6"/>
      <text x="150" y="100" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="16">
        Image unavailable offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-96x96.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Loaded successfully');
