import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './modules/user/user.routes';

const router = express.Router();

function routes() {
  /** Healthcheck */
  router.get('/ping', (_: Request, res: Response, __: NextFunction): void => {
      res.status(200).json({ message: 'pong' });
  });

  /** Users */
  router.use('/users', userRoutes);
}

export default routes;
