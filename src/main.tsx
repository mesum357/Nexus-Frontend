import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('🔄 New app version available! Please refresh.');
                
                // Optionally show a notification to the user
                if (window.confirm('New version available! Refresh to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// PWA Install Prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💡 PWA install prompt available');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Optionally show your own install button
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  console.log('🎉 PWA was installed successfully!');
  hideInstallButton();
});

function showInstallButton() {
  // Create and show install button
  const installButton = document.createElement('button');
  installButton.id = 'pwa-install-button';
  installButton.innerHTML = '📱 Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2563eb;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    transition: all 0.3s ease;
  `;
  
  installButton.addEventListener('mouseenter', () => {
    installButton.style.background = '#1d4ed8';
    installButton.style.transform = 'translateY(-2px)';
  });
  
  installButton.addEventListener('mouseleave', () => {
    installButton.style.background = '#2563eb';
    installButton.style.transform = 'translateY(0)';
  });
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      hideInstallButton();
    }
  });
  
  // Only show if not already installed
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    document.body.appendChild(installButton);
  }
}

function hideInstallButton() {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.remove();
  }
}

// Hide install button if already running as PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('🚀 Running as PWA');
  hideInstallButton();
}

createRoot(document.getElementById("root")!).render(<App />);
