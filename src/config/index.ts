import dotenv from 'dotenv';
import getDevelopmentEnvironment from './development';
import type { Config } from './Config';
import getProductionEnvironment from './production';

dotenv.config();

let config: Config;
if (process.env.NODE_ENV?.trim() === 'development') {
  config = getDevelopmentEnvironment();
} else {
  config = getProductionEnvironment();
}

export default config;
