/**
 * Centralized API URL resolution for Zaika Frontend.
 * Supports VITE_API_BASE_URL (e.g. https://zaika-api.onrender.com)
 * or VITE_API_URL (e.g. https://zaika-api.onrender.com/api or /api).
 */

export function getRawApiUrl() {
  return import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
}

export function getApiBaseUrl() {
  const url = getRawApiUrl();
  if (!url) return '';
  return url.replace(/\/api\/?$/i, '').replace(/\/$/, '');
}

export function getApiUrl(path = '') {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (cleanPath.startsWith('/api/')) {
    return base ? `${base}${cleanPath}` : cleanPath;
  }
  
  return base ? `${base}/api${cleanPath}` : `/api${cleanPath}`;
}
