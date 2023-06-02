import dotenv from 'dotenv';
import { nonNullValue } from '../utils/nonNull';
import { Config } from './IConfig';

dotenv.config();

function getProductionEnvironment(): Config {
  return {
    HOSTNAME: 'http://api.portfolioinstruments.com',
    PORT: Number(nonNullValue(process.env.PORT)),
    JWT_ACCESS_TOKEN_SECRET: nonNullValue(process.env.JWT_ACCESS_TOKEN_SECRET),
    JWT_REFRESH_TOKEN_SECRET: nonNullValue(process.env.JWT_REFRESH_TOKEN_SECRET),
    JWT_EMAIL_TOKEN_SECRET: nonNullValue(process.env.JWT_EMAIL_TOKEN_SECRET),
    SALT_WORK_FACTOR: Number(nonNullValue(process.env.SALT_WORK_FACTOR)),
    DB_HOST: nonNullValue(process.env.DB_HOST),
    DB_PORT: Number(nonNullValue(process.env.DB_PORT)),
    DB_USER: nonNullValue(process.env.DB_USER),
    DB_PASSWORD: nonNullValue(process.env.DB_PASSWORD),
    DB_NAME: nonNullValue(process.env.DB_NAME),
  };
}

export default getProductionEnvironment;
