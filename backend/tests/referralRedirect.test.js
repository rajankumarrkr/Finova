import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Referral & Registration Redirect Integration Tests', () => {
  it('should redirect GET /api/register?ref=YADA3344 with 302 to frontend registration page', async () => {
    const res = await request(app).get('/api/register?ref=YADA3344');
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/register?ref=YADA3344');
  });

  it('should redirect GET /register?ref=YADA3344 with 302', async () => {
    const res = await request(app).get('/register?ref=YADA3344');
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/register?ref=YADA3344');
  });

  it('should redirect GET /api/auth/register without ref correctly', async () => {
    const res = await request(app).get('/api/auth/register');
    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/\/register$/);
  });
});
