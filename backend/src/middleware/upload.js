import multer from 'multer';
import path from 'path';
import { ApiResponse } from '../utils/apiResponse.js';

// Memory storage keeps files in RAM temporarily — no persistent filesystem writing on Render
const storage = multer.memoryStorage();

// Allowed avatar file extensions and MIME types
const ALLOWED_AVATAR_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_AVATAR_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

// File filter validation
const avatarFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isMimeValid = ALLOWED_AVATAR_MIMES.includes(mime);
  const isExtValid = ALLOWED_AVATAR_EXTS.includes(ext);

  if (isMimeValid && isExtValid) {
    return cb(null, true);
  }

  const err = new Error('Unsupported file type. Only JPEG, PNG, and WEBP formats are allowed.');
  err.code = 'UNSUPPORTED_FILE_TYPE';
  err.statusCode = 415;
  return cb(err, false);
};

// Base multer configuration for avatar (5MB limit)
const uploadAvatarMulter = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: avatarFileFilter
}).single('avatar');

/**
 * Middleware for handling avatar upload with explicit HTTP status codes:
 * - 400: Invalid / missing file
 * - 413: File too large
 * - 415: Unsupported file type
 */
export const uploadAvatarMiddleware = (req, res, next) => {
  uploadAvatarMulter(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return ApiResponse.error(
          res,
          'File size exceeds the maximum limit of 5MB',
          'FILE_TOO_LARGE',
          413
        );
      }
      if (err.code === 'UNSUPPORTED_FILE_TYPE' || err.statusCode === 415) {
        return ApiResponse.error(
          res,
          err.message || 'Unsupported file type. Only JPEG, PNG, and WEBP are allowed.',
          'UNSUPPORTED_MEDIA_TYPE',
          415
        );
      }
      return ApiResponse.error(
        res,
        err.message || 'Invalid file upload request',
        'INVALID_FILE',
        400
      );
    }

    if (!req.file) {
      return ApiResponse.error(
        res,
        'No file uploaded. Please select an image (JPEG, PNG, or WEBP).',
        'FILE_REQUIRED',
        400
      );
    }

    next();
  });
};
