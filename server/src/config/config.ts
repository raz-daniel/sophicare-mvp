import { IConfig } from '../types/IConfig';
import dotenv from 'dotenv';
import { validateEnv } from './env-validator';

dotenv.config();

const config: IConfig = {
  app: {
    name: 'SophieCare MVP',
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sophicare',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY as string,
  }
};

validateEnv();

export default config; 