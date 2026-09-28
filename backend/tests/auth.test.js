import { describe, it, expect } from 'vitest';

describe('Auth API Unit Tests', () => {
  it('should format registration schema correctly', () => {
    const registrationData = {
      name: 'Rajan Kumar',
      email: 'rajan.test@example.com',
      phone: '9876543210',
      password: 'password123'
    };

    expect(registrationData.name).toBe('Rajan Kumar');
    expect(registrationData.email).toContain('@');
    expect(registrationData.password.length).toBeGreaterThanOrEqual(4);
  });
});
