/**
 * Format numbers as Indian Rupee (₹) currency strings
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00";
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(num);
};

/**
 * Format plain numbers with Indian standard separators
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Copy text to clipboard and invoke optional callback
 */
export const copyToClipboard = async (text, onSuccess) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    if (onSuccess) onSuccess();
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};
