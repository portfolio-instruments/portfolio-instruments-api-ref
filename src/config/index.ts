import development from './development';
import production from './production';
import dotenv from 'dotenv';

dotenv.config();

let config;
if (process.env.NODE_ENV === 'development') {
  config = development;
} else {
  config = production;
}

export default config;
