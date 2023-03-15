import type { Express, NextFunction, Request, Response } from 'express';
import sessionRoutes from './modules/session/session.routes';
import userRoutes from './modules/user/user.routes';

function routes(app: Express) {
  /** Healthcheck */
  app.get('/ping', (_: Request, res: Response, __: NextFunction): void => {
    res.status(200).json({ message: 'pong' });
  });

  /** Session */
  app.use('/v1/sessions', sessionRoutes);

  /** Users */
  app.use('/v1/users', userRoutes);
}

export default routes;
