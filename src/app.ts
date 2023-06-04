import config from './config';
import createServer from './createServer';
import Logger from './utils/Logger';
import type { Express } from 'express';

/**
 * Declare production app and port listening in a separate file,
 * that way we can reuse the app instance for our tests
 * while also avoiding possible port collision issues
 * when running multiple concurrent tests in Jest.
 *
 * See: https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
 */
const app: Express = createServer();
app.listen(config.PORT, () => Logger.info(`App server started on port ${config.PORT}`));
