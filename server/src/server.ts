import { start } from './app';

start().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
