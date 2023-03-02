import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { errorFallbackHandler, notFoundHandler } from './middleware/errorHandlers';
import routes from './routes';
import Logger from './utils/Logger';
import trafficLogger from './middleware/trafficLogger';
import initProcessErrorHandler from './errors/processErrorHandler';

const app = express();

/** Startup */
initProcessErrorHandler();

/** Log inbound and outbound traffic */
app.use(trafficLogger);

/** Basic security & performance  */
app.use(helmet());
app.use(compression());

/** Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** API rules */
app.use(
  (req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-ALlow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      res.status(200).json({});
      return;
    }

    next();
  }
);

/** Routes */
routes(app);

/** Error handling */
app.use(notFoundHandler);
app.use(errorFallbackHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => Logger.info(`App server started on port ${PORT}`));
