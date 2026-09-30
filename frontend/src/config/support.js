/**
 * Telegram Support Configuration
 * Set to official Finova Telegram Support: https://t.me/Finovasuport
 * Can also be overridden via VITE_TELEGRAM_SUPPORT_URL in frontend .env file.
 */
export const TELEGRAM_SUPPORT_URL = import.meta.env.VITE_TELEGRAM_SUPPORT_URL || 'https://t.me/Finovasuport';

/**
 * Returns formatted Telegram URL
 */
export const getTelegramSupportUrl = () => {
  const url = TELEGRAM_SUPPORT_URL;
  if (!url || url === '#') {
    return 'https://t.me/Finovasuport';
  }
  return url.startsWith('http') ? url : `https://t.me/${url.replace(/^@/, '')}`;
};

/**
 * Redirect / Open Telegram Support in a new window or tab
 */
export const openTelegramSupport = () => {
  const url = getTelegramSupportUrl();
  window.open(url, '_blank', 'noopener,noreferrer');
};
