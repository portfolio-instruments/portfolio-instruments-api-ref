import { Role } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import type { ValidUserRequest } from './deserializeUser';

export function requireUser(req: Request & ValidUserRequest, __: Response, next: NextFunction): void {
  if (!req.user) {
    next(ApiError.unauthorized('Missing the credentials to access this resource.'));
    return;
  }
  next();
}

export function requireAdmin(req: Request & ValidUserRequest, __: Response, next: NextFunction): void {
  if (!req.user) {
    next(ApiError.unauthorized('Missing the credentials required to access this qource.'));
    return;
  }
  if (req.user.role !== Role.ADMIN) {
    next(ApiError.forbidden('Missing the appropriate permissions level to access this resource.'));
    return;
  }
  next();
}
