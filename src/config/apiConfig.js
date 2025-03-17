// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'psaj-localova-production.up.railway.app';

// API endpoints
export const ENDPOINTS = {
  CREATE_PAYMENT: `${API_BASE_URL}/api/create-payment`,
}; 