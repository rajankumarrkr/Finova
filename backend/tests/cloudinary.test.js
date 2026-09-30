import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateCloudinaryConfig } from '../src/config/cloudinary.js';
import { CloudinaryService } from '../src/services/cloudinary.service.js';

describe('Cloudinary Integration & Upload Validation Tests', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  describe('Configuration Validation', () => {
    it('should throw clear error during startup when configuration is missing', () => {
      delete process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.CLOUDINARY_API_KEY;
      delete process.env.CLOUDINARY_API_SECRET;

      expect(() => validateCloudinaryConfig()).toThrow(
        /\[Cloudinary Config Error\]: Missing required Cloudinary configuration/
      );
    });

    it('should pass validation when all required Cloudinary variables are present', () => {
      process.env.CLOUDINARY_CLOUD_NAME = 'finova-test';
      process.env.CLOUDINARY_API_KEY = '1234567890';
      process.env.CLOUDINARY_API_SECRET = 'mock_secret_abc123';

      expect(() => validateCloudinaryConfig()).not.toThrow();
    });
  });

  describe('Folder Organization & Transformation Options', () => {
    it('should organize uploads into user-specific avatar folder with face transformations', async () => {
      const mockUploadResult = {
        public_id: 'finova/users/user123/avatar/test_id',
        secure_url: 'https://res.cloudinary.com/finova/image/upload/v1234/test.jpg',
        resource_type: 'image',
        format: 'webp',
        bytes: 10240,
        width: 400,
        height: 400,
        created_at: '2026-09-29T00:00:00Z'
      };

      process.env.CLOUDINARY_CLOUD_NAME = 'finova-test';
      process.env.CLOUDINARY_API_KEY = '1234567890';
      process.env.CLOUDINARY_API_SECRET = 'mock_secret_abc123';

      vi.spyOn(CloudinaryService, 'uploadBuffer').mockResolvedValue(mockUploadResult);

      const buffer = Buffer.from('fake-image-content');
      const result = await CloudinaryService.uploadAvatar('user123', buffer);

      expect(CloudinaryService.uploadBuffer).toHaveBeenCalledWith(
        buffer,
        expect.objectContaining({
          folder: 'finova/users/user123/avatar',
          resource_type: 'image',
          transformation: expect.arrayContaining([
            expect.objectContaining({
              width: 400,
              height: 400,
              crop: 'fill',
              gravity: 'face'
            }),
            expect.objectContaining({
              quality: 'auto',
              fetch_format: 'auto'
            })
          ])
        })
      );

      expect(result.public_id).toBe(mockUploadResult.public_id);
      expect(result.secure_url).toBe(mockUploadResult.secure_url);
      expect(result.bytes).toBe(10240);
      expect(result.width).toBe(400);
      expect(result.height).toBe(400);

      vi.restoreAllMocks();
    });

    it('should upload document or deposit receipt to specified folder', async () => {
      process.env.CLOUDINARY_CLOUD_NAME = 'finova-test';
      process.env.CLOUDINARY_API_KEY = '1234567890';
      process.env.CLOUDINARY_API_SECRET = 'mock_secret_abc123';

      const mockUploadDocResult = {
        public_id: 'finova/users/user123/deposits/receipt_99',
        secure_url: 'https://res.cloudinary.com/finova/image/upload/v1234/receipt.png',
        format: 'png',
        bytes: 5120,
        created_at: '2026-09-30T00:00:00Z'
      };

      const cloudinary = (await import('../src/config/cloudinary.js')).default;
      vi.spyOn(cloudinary.uploader, 'upload').mockResolvedValue(mockUploadDocResult);

      const result = await CloudinaryService.uploadDocument('user123', 'data:image/png;base64,fake-data', 'deposits');

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        'data:image/png;base64,fake-data',
        expect.objectContaining({
          folder: 'finova/users/user123/deposits',
          resource_type: 'auto'
        })
      );

      expect(result.public_id).toBe(mockUploadDocResult.public_id);
      expect(result.secure_url).toBe(mockUploadDocResult.secure_url);

      vi.restoreAllMocks();
    });
  });

  describe('Asset Deletion Handling', () => {
    it('should handle deletion gracefully when publicId is null or empty', async () => {
      const result = await CloudinaryService.deleteAsset(null);
      expect(result.success).toBe(true);
    });

    it('should never expose credentials on deletion error', async () => {
      process.env.CLOUDINARY_CLOUD_NAME = 'finova-test';
      process.env.CLOUDINARY_API_KEY = '1234567890';
      process.env.CLOUDINARY_API_SECRET = 'mock_secret_abc123';

      const cloudinary = (await import('../src/config/cloudinary.js')).default;
      vi.spyOn(cloudinary.uploader, 'destroy').mockRejectedValue(new Error('Cloudinary network timeout'));

      const result = await CloudinaryService.deleteAsset('sample_public_id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cloudinary network timeout');
      expect(JSON.stringify(result)).not.toContain('process.env.CLOUDINARY_API_SECRET');

      vi.restoreAllMocks();
    });
  });
});
