import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler, notFoundHandler } from './middleware/error';
import { initProcessErrorHandler } from './errors/processErrorHandler';
import usersRouter from './routes/users';
import Logging from './library/Logging';

const app = express();

/** Startup */
initProcessErrorHandler();

/** Log the request and response */
app.use(
  (req: Request, res: Response, next: NextFunction): void => {
    Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - Ip: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
      Logging.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - Ip: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });

    next();
  }
);

app.use(helmet());
app.use(compression());

/** Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** API Rules */
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
app.use('/v1/users', usersRouter);

/** Healthcheck */
app.get(
  '/ping',
  (_, res, __): void => {
    res.status(200).json({ message: 'pong' });
  }
);

/** Error handling */
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => Logging.info(`Server started on port ${PORT}`));
