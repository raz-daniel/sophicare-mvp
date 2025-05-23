import express, { Express } from 'express';
import cors from 'cors';
import { notFound } from './middleware/not-found';
import { errorLogger } from './middleware/error/error-logger';
import { errorResponder } from './middleware/error/error-responder';
import { connectWithRetry, closeConnection } from './db/mongoose';
import config from './config/config';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';

const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/health', healthRoutes);
  app.use('/api/auth', authRoutes);

  app.use(notFound);
  app.use(errorLogger);
  app.use(errorResponder);

  return app;
};

const setupGracefulShutdown = (server: any): void => {
  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closeConnection();
      console.log('Process terminated');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

const start = async (): Promise<void> => {
  try {
    await connectWithRetry();

    const app = createApp();
    const server = app.listen(config.app.port, () => {
      console.log(`${config.app.name} is running on port ${config.app.port}`);
    });

    setupGracefulShutdown(server);

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

export { createApp, start };