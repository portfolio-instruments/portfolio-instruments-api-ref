import dotenv from 'dotenv';
import { nonNullValue } from '../utils/nonNull';
import type { Config } from './IConfig';

dotenv.config();

function getProductionEnvironment(): Config {
  return {
    HOSTNAME: 'http://api.portfolioinstruments.com',
    PORT: Number(nonNullValue(process.env.PORT)),
    JWT_ACCESS_TOKEN_SECRET: nonNullValue(process.env.JWT_ACCESS_TOKEN_SECRET),
    JWT_REFRESH_TOKEN_SECRET: nonNullValue(process.env.JWT_REFRESH_TOKEN_SECRET),
    JWT_EMAIL_TOKEN_SECRET: nonNullValue(process.env.JWT_EMAIL_TOKEN_SECRET),
    SALT_WORK_FACTOR: Number(nonNullValue(process.env.SALT_WORK_FACTOR)),
  };
}

export default getProductionEnvironment;
