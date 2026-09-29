import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Checks if all required Cloudinary variables are configured
 */
export const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.CLOUDINARY_API_KEY?.trim() &&
    process.env.CLOUDINARY_API_SECRET?.trim()
  );
};

/**
 * Validates Cloudinary environment variables.
 * Fails clearly during startup in production or test mode if required Cloudinary configuration is missing.
 * In development mode, logs a clear warning so the local dev server remains functional for other tasks.
 */
export const validateCloudinaryConfig = (strict = false) => {
  const missing = [];
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_CLOUD_NAME.trim()) {
    missing.push('CLOUDINARY_CLOUD_NAME');
  }
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_KEY.trim()) {
    missing.push('CLOUDINARY_API_KEY');
  }
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_SECRET.trim()) {
    missing.push('CLOUDINARY_API_SECRET');
  }

  if (missing.length > 0) {
    const errorMsg = `[Cloudinary Config Error]: Missing required Cloudinary configuration: ${missing.join(
      ', '
    )}. Please define them in backend/.env for local development or in your Render environment variables.`;

    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' || strict) {
      throw new Error(errorMsg);
    } else {
      console.warn(`\n⚠️  ${errorMsg}`);
      console.warn('⚠️  [Dev Notice]: Server is running in development mode. Cloudinary uploads will require valid credentials in backend/.env.\n');
    }
  }
};

// Configure official Cloudinary Node.js SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

export default cloudinary;

