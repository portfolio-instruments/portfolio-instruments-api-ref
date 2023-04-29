import type { Express, NextFunction, Request, Response } from 'express';
import sessionRoutes from './modules/session/session.routes';
import userRoutes from './modules/user/user.routes';

function routes(app: Express) {
  /**
   * @openapi
   * /ping:
   *    get:
   *      summary: Checks if the app is up and running
   *      tags:
   *        - Healthcheck
   *      responses:
   *        200:
   *          description: App is up and running
   */
  app.get('/v1/ping', (_: Request, res: Response, __: NextFunction): void => {
    res.status(200).json({ message: 'pong' });
  });

  /** Sessions */
  app.use('/v1/sessions', sessionRoutes);

  /** Users */
  app.use('/v1/users', userRoutes);
}

export default routes;
