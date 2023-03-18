import { Role } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import { ValidUserRequest } from './deserializeUser';

export function requireUser(req: ValidUserRequest & Request, __: Response, next: NextFunction): void {
  if (!req.locals?.user) {
    next(ApiError.unauthorized('Missing the credentials to access this resource.'));
    return;
  }
  next();
}

export function requireAdmin(req: ValidUserRequest & Request, __: Response, next: NextFunction): void {
  if (!req.locals?.user) {
    next(ApiError.unauthorized('Missing the credentials required to access this qource.'));
    return;
  }
  if (req.locals.user.role !== Role.ADMIN) {
    next(ApiError.forbidden('Missing the appropriate permissions level to access this resource.'));
    return;
  }
  next();
}
