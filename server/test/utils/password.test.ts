import { describe, it, expect } from '@jest/globals';
import { validatePassword } from '../../src/utils/password';

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should accept a valid password', () => {
      const validPassword = 'StrongP@ss123';
      const errors = validatePassword(validPassword);
      expect(errors).toHaveLength(0);
    });

    it('should reject password without uppercase letter', () => {
      const password = 'strongp@ss123';
      const errors = validatePassword(password);
      expect(errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const password = 'STRONGP@SS123';
      const errors = validatePassword(password);
      expect(errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const password = 'StrongP@ss';
      const errors = validatePassword(password);
      expect(errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const password = 'StrongPass123';
      const errors = validatePassword(password);
      expect(errors).toContain('Password must contain at least one special character');
    });

    it('should reject password shorter than 8 characters', () => {
      const password = 'Str@1';
      const errors = validatePassword(password);
      expect(errors).toContain('Password must be at least 8 characters long');
    });

    it('should return multiple errors for invalid password', () => {
      const password = 'weak';
      const errors = validatePassword(password);
      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain('Password must be at least 8 characters long');
      expect(errors).toContain('Password must contain at least one uppercase letter');
      expect(errors).toContain('Password must contain at least one number');
      expect(errors).toContain('Password must contain at least one special character');
    });
  });
}); 