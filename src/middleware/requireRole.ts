import { Role } from '@prisma/client';
import type { NextFunction, Response } from 'express';
import ApiError from '../errors/ApiError';
import type { ValidUserRequest } from './deserializeUser';
import type { BaseRequest } from '../BaseRequest';

const unauthorized: string = 'Missing the credentials required to access this resource.';

export function requireUser(req: BaseRequest & ValidUserRequest, __: Response, next: NextFunction): void {
  if (!req.user) {
    next(ApiError.unauthorized(unauthorized));
    return;
  }
  next();
}

export function requireAdmin(req: BaseRequest & ValidUserRequest, __: Response, next: NextFunction): void {
  if (!req.user) {
    next(ApiError.unauthorized(unauthorized));
    return;
  }
  if (req.user.role !== Role.ADMIN) {
    next(ApiError.forbidden('Missing the appropriate permissions level required to access this resource.'));
    return;
  }
  next();
}
