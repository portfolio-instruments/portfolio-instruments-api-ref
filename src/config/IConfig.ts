export interface Config {
  HOSTNAME: string;
  PORT: number;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_EMAIL_TOKEN_SECRET: string;
  SALT_WORK_FACTOR: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}
