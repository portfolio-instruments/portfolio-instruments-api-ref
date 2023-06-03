import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { VerifiedJwt, verifyJwt } from '../modules/session/session.utils';
import { nonNullProp } from '../utils/nonNull';
import ApiError from '../errors/ApiError';

export interface ValidUserRequest {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function deserializeUser(req: Request & ValidUserRequest, __: Response, next: NextFunction): void {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '');

  if (!accessToken) {
    next();
    return;
  }

  const jwtResponse: VerifiedJwt<User> = verifyJwt(accessToken, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'));
  if (jwtResponse.expired) {
    next(ApiError.unauthorized('Access token expired.'));
    return;
  } else if (!jwtResponse.valid) {
    next(ApiError.unauthorized('Invalid access token.'));
    return;
  }

  const user = nonNullProp(jwtResponse, 'decoded');

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
}
