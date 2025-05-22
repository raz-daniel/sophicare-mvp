export interface IConfig {
  app: {
    name: string;
    port: number;
    env: string;
  };
  db: {
    uri: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
} 