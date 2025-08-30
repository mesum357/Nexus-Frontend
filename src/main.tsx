import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PWA functionality temporarily disabled for deployment
// Will be re-enabled after successful build

// PWA Service Worker Registration (DISABLED)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('✅ Service Worker registered successfully:', registration.scope);
//       })
//       .catch((error) => {
//         console.error('❌ Service Worker registration failed:', error);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
