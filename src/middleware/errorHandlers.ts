import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import { formatResponseError } from '../errors/formatErrors';

export function notFoundHandler(_: Request, __: Response, next: NextFunction): void {
  next(ApiError.notFound('Sorry, the page you are looking for could not be found.'));
}

export async function errorFallbackHandler(err: Error, _: Request, res: Response, ___: NextFunction): Promise<void> {
  if (err instanceof ApiError) {
    res.status(err.status).json(formatResponseError(err.status, err.message));
    return;
  }
  res.status(500).json(formatResponseError(500, 'The server encountered an internal error and was unable to complete your request'));
}
