export const generateTransactionId = (prefix = 'TXN') => {
  const dateStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 8);
  const randomStr = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${dateStr}-${randomStr}`;
};
