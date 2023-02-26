import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';

export function notFoundHandler(_: Request, __: Response, next: NextFunction): void {
  next(ApiError.notFound('Sorry, the page you are looking for could not be found.'));
}

export async function errorHandler(err: Error, _: Request, res: Response, __: NextFunction): Promise<void> {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: 'The server encountered an internal error and was unable to complete your request.' });
}
