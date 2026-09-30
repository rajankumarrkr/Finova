/**
 * Media & Image URL Helper for Finova Frontend
 * Handles Cloudinary URLs, local uploaded assets, base64 data URIs, and cross-origin fallbacks.
 */
import { API_BASE_URL } from '../lib/api';

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
export const DEFAULT_RECEIPT_PLACEHOLDER = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80';

// Derive backend origin from API_BASE_URL (strips /api)
const getBackendOrigin = () => {
  try {
    const parsed = new URL(API_BASE_URL);
    return parsed.origin;
  } catch {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://finova-sv93.onrender.com';
  }
};

const BACKEND_ORIGIN = getBackendOrigin();

/**
 * Resolves any image source (object, relative path, base64 data URI, or full URL)
 * into a safe, displayable image URL.
 *
 * @param {string|object} source - Raw image data from API or component state
 * @param {'avatar'|'proof'} fallbackType - Type of fallback if source is invalid
 * @returns {string} Fully qualified displayable image URL
 */
export const getMediaUrl = (source, fallbackType = 'avatar') => {
  const defaultFallback = fallbackType === 'proof' ? DEFAULT_RECEIPT_PLACEHOLDER : DEFAULT_AVATAR;

  if (!source) return defaultFallback;

  // Handle nested object { url, secure_url, publicId }
  let urlStr = source;
  if (typeof source === 'object') {
    urlStr = source.url || source.secure_url || source.path || '';
  }

  if (typeof urlStr !== 'string') return defaultFallback;

  urlStr = urlStr.trim();
  if (!urlStr || urlStr === '[object Object]') return defaultFallback;

  // Base64 data URIs or local object URLs load directly in all browsers
  if (urlStr.startsWith('data:image/') || urlStr.startsWith('blob:')) {
    return urlStr;
  }

  // Relative upload paths (/uploads/...) need the backend origin
  if (urlStr.startsWith('/uploads/') || urlStr.startsWith('uploads/')) {
    const cleanPath = urlStr.startsWith('/') ? urlStr : `/${urlStr}`;
    return `${BACKEND_ORIGIN}${cleanPath}`;
  }

  // Mixed-content prevention: If on HTTPS (e.g. Vercel) and URL is http://localhost:5000
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && urlStr.startsWith('http://localhost:')) {
    const uploadPathIndex = urlStr.indexOf('/uploads/');
    if (uploadPathIndex !== -1) {
      return `https://finova-sv93.onrender.com${urlStr.substring(uploadPathIndex)}`;
    }
  }

  return urlStr;
};

/**
 * Image onError handler to seamlessly swap in fallback placeholder
 * and prevent infinite loops.
 */
export const handleImageError = (e, fallbackType = 'avatar') => {
  if (e.target && !e.target.dataset.hasFallback) {
    e.target.dataset.hasFallback = 'true';
    e.target.src = fallbackType === 'proof' ? DEFAULT_RECEIPT_PLACEHOLDER : DEFAULT_AVATAR;
  }
};
