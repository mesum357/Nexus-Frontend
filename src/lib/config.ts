// Configuration for API base URL
// Uses environment variables in both development and production
// For local development: http://localhost:3000
// For production: Set VITE_API_BASE_URL or VITE_API_URL in Render dashboard
const envApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

export const API_BASE_URL = envApiUrl || (
  import.meta.env.PROD 
    ? (() => {
        console.warn('⚠️ VITE_API_BASE_URL or VITE_API_URL not set! Falling back to Railway URL. Please set the environment variable in Render dashboard.');
        return 'https://nexusbackend-production.up.railway.app'; // Fallback for backward compatibility
      })()
    : 'http://localhost:3000'
);

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
}
