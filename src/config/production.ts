import dotenv from 'dotenv';

dotenv.config();

export default {
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_EMAIL_TOKEN_SECRET: process.env.JWT_EMAIL_TOKEN_SECRET,
};
