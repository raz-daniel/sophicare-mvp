
export const validateEnv = (): void => {
  const required = [
    'PORT',
    'MONGODB_URI',
    'NODE_ENV',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
  ];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}; 