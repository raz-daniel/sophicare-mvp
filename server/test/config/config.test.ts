import config from '../../src/config/config';
import { describe, it, expect } from '@jest/globals';

describe('Config', () => {
  it('should have required properties', () => {
    expect(config).toHaveProperty('app');
    expect(config.app).toHaveProperty('name');
    expect(config.app).toHaveProperty('port');
    expect(config.app).toHaveProperty('env');

    expect(config).toHaveProperty('db');
    expect(config.db).toHaveProperty('uri');

    expect(config).toHaveProperty('auth');
    expect(config.auth).toHaveProperty('jwtSecret');
    expect(config.auth).toHaveProperty('jwtExpiresIn');
  });

  it('should have correct types', () => {
    expect(typeof config.app.name).toBe('string');
    expect(typeof config.app.port).toBe('number');
    expect(typeof config.app.env).toBe('string');
    expect(typeof config.db.uri).toBe('string');
    expect(typeof config.auth.jwtSecret).toBe('string');
    expect(typeof config.auth.jwtExpiresIn).toBe('string');
  });
}); 