import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { CloudinaryService } from '../src/services/cloudinary.service.js';

describe('Avatar Endpoints Integration Tests', () => {
  let mockToken;
  const mockUserId = '6aba50f86c2687332f8f62c3';

  beforeAll(() => {
    mockToken = jwt.sign(
      { id: mockUserId, role: 'user' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication Check', () => {
    it('should reject unauthenticated upload with 401', async () => {
      const res = await request(app)
        .post('/api/users/avatar')
        .attach('avatar', Buffer.from('fake image content'), 'test.png');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated avatar deletion with 401', async () => {
      const res = await request(app).delete('/api/users/avatar');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('File Validation', () => {
    it('should reject requests without a file with 400', async () => {
      const mockUserDoc = {
        _id: mockUserId,
        status: 'active',
        name: 'Test User',
        avatar: { url: 'https://sample.jpg', publicId: null }
      };
      vi.spyOn(User, 'findById').mockResolvedValue(mockUserDoc);

      const res = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${mockToken}`)
        .field('dummy', 'field');

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('FILE_REQUIRED');
    });

    it('should reject unsupported file types (e.g. .txt, .pdf) with 415', async () => {
      const mockUserDoc = {
        _id: mockUserId,
        status: 'active',
        name: 'Test User',
        avatar: { url: 'https://sample.jpg', publicId: null }
      };
      vi.spyOn(User, 'findById').mockResolvedValue(mockUserDoc);

      const res = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${mockToken}`)
        .attach('avatar', Buffer.from('plain text file'), 'notes.txt');

      expect(res.status).toBe(415);
      expect(res.body.code).toBe('UNSUPPORTED_MEDIA_TYPE');
    });
  });

  describe('Upload & Cloudinary Flow', () => {
    it('should upload avatar, persist metadata, and return secure_url and public_id', async () => {
      const mockCloudinaryResult = {
        public_id: `finova/users/${mockUserId}/avatar/mock_id_99`,
        secure_url: 'https://res.cloudinary.com/finova/image/upload/v12345/avatar.webp',
        resource_type: 'image',
        format: 'webp',
        bytes: 2048,
        width: 400,
        height: 400,
        created_at: new Date().toISOString()
      };

      vi.spyOn(CloudinaryService, 'uploadAvatar').mockResolvedValue(mockCloudinaryResult);
      vi.spyOn(CloudinaryService, 'deleteAsset').mockResolvedValue({ success: true });

      const mockUserDoc = {
        _id: mockUserId,
        status: 'active',
        name: 'Test User',
        avatar: { url: 'https://old-avatar.jpg', publicId: 'old_public_id' },
        save: vi.fn().mockResolvedValue(true)
      };
      vi.spyOn(User, 'findById').mockResolvedValue(mockUserDoc);

      const res = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${mockToken}`)
        .attach('avatar', Buffer.from('fake-valid-png-data'), 'avatar.png');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.avatar.url).toBe(mockCloudinaryResult.secure_url);
      expect(res.body.data.avatar.publicId).toBe(mockCloudinaryResult.public_id);
      expect(mockUserDoc.avatar.url).toBe(mockCloudinaryResult.secure_url);
      expect(mockUserDoc.avatar.publicId).toBe(mockCloudinaryResult.public_id);
      expect(mockUserDoc.save).toHaveBeenCalled();
      expect(CloudinaryService.deleteAsset).toHaveBeenCalledWith('old_public_id');
    });
  });

  describe('Avatar Removal Flow', () => {
    it('should delete asset from Cloudinary and reset user avatar to default', async () => {
      vi.spyOn(CloudinaryService, 'deleteAsset').mockResolvedValue({ success: true });

      const mockUserDoc = {
        _id: mockUserId,
        status: 'active',
        name: 'Test User',
        avatar: { url: 'https://res.cloudinary.com/...', publicId: 'current_public_id' },
        save: vi.fn().mockResolvedValue(true)
      };
      vi.spyOn(User, 'findById').mockResolvedValue(mockUserDoc);

      const res = await request(app)
        .delete('/api/users/avatar')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.avatar.publicId).toBeNull();
      expect(CloudinaryService.deleteAsset).toHaveBeenCalledWith('current_public_id');
      expect(mockUserDoc.save).toHaveBeenCalled();
    });
  });
});
