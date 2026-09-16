import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';

describe('Authentication & Security Integrity', () => {
  it('should securely hash password and verify match with bcrypt', async () => {
    const rawPassword = 'Student@123';
    const hash = await bcrypt.hash(rawPassword, 10);

    expect(hash).not.toBe(rawPassword);
    const isValid = await bcrypt.compare(rawPassword, hash);
    expect(isValid).toBe(true);

    const isWrongValid = await bcrypt.compare('WrongPassword@999', hash);
    expect(isWrongValid).toBe(false);
  });

  it('should sign and verify JWT tokens containing user role', () => {
    const userPayload = {
      id: 'usr_test_123',
      email: 'test.student@campusbite.local',
      role: 'STUDENT',
      name: 'Test Student',
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, JWT_SECRET) as typeof userPayload;
    expect(decoded.id).toBe(userPayload.id);
    expect(decoded.email).toBe(userPayload.email);
    expect(decoded.role).toBe('STUDENT');
  });
});
