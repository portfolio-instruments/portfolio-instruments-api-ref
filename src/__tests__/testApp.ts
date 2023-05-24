import { Express } from 'express';
import createServer from '../createServer';

/** Shared test instance of the app */
const testApp: Express = createServer();
export default testApp;
