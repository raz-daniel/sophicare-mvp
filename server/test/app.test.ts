import request from 'supertest';
import { createApp } from '../src/app';
import { describe, it, expect } from '@jest/globals';

describe('App', () => {
  it('should create app without crashing', () => {
    const app = createApp();
    expect(app).toBeDefined();
  });

  it('should respond to health check', async () => {
    const app = createApp();
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Server is healthy');
    expect(response.body).toHaveProperty('timestamp');
  });
}); 