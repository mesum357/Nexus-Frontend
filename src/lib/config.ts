// Configuration for API base URL
// In production, use Railway backend URL
// In development, use environment variables or fallback to localhost
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://nexusbackend-production.up.railway.app'
  : (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000');
