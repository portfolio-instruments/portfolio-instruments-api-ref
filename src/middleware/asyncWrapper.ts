import type { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';

type AsyncProcess<T, V, W> = (req: T, res: V, next: W) => unknown;

function asyncWrapper<T extends Request, V extends Response, W extends NextFunction>(asyncProcess: AsyncProcess<T, V, W>) {
  return async (req: T, res: V, next: W) => {
    try {
      await asyncProcess(req, res, next);
    } catch (e: unknown) {
      const err = e as Error;
      if (err instanceof ApiError) {
        next(err);
      } else {
        next(ApiError.internal(err.message));
      }
    }
  };
}

export default asyncWrapper;
