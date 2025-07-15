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
    jwtAccessExpiresIn: string;
    jwtRefreshExpiresIn: string;
  };
  google: {
    clientId: string;
  },
  openai: {
    apiKey: string;
  }
} 