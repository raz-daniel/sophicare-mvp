import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import config from '../config/config';
import { AppError } from '../errors/AppError';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

const connectWithRetry = async (retryCount = 0): Promise<void> => {
  try {
    await mongoose.connect(config.db.uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`MongoDB connection failed. Retrying in ${RETRY_INTERVAL/1000} seconds...`);
      setTimeout(() => connectWithRetry(retryCount + 1), RETRY_INTERVAL);
    } else {
      throw new AppError(
        'Failed to connect to MongoDB after multiple attempts',
        StatusCodes.INTERNAL_SERVER_ERROR,
        'DB_CONNECTION_ERROR',
        error
      );
    }
  }
};

const closeConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

export { connectWithRetry, closeConnection, mongoose }; 