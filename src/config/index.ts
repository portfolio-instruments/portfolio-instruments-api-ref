import development from './development';
import production from './production';
import dotenv from 'dotenv';

export interface Config {
  HOSTNAME?: string;
  PORT?: number;
  JWT_ACCESS_TOKEN_SECRET?: string;
  JWT_REFRESH_TOKEN_SECRET?: string;
  JWT_EMAIL_TOKEN_SECRET?: string;
  SALT_WORK_FACTOR?: number;
}

dotenv.config();

let config: Config;
if (process.env.NODE_ENV === 'development') {
  config = development;
} else {
  config = production;
}

export default config;
