import type { User } from '@prisma/client';
import type { NextFunction, Response } from 'express';
import config from '../config';
import type { VerifiedJwt } from '../modules/session/session.utils';
import { verifyJwt } from '../modules/session/session.utils';
import { nonNullProp } from '../utils/nonNull';
import ApiError from '../errors/ApiError';
import type { BaseRequest } from '../BaseRequest';
import { convertUnixTimestampToDateString } from '../utils/convertUnixTimestampToDateString';

export interface ValidUserRequest {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    issuedAt: string;
    expiresAt: string;
  };
}

export type ValidUser = ValidUserRequest['user'];

export default function deserializeUser(req: BaseRequest & ValidUserRequest, __: Response, next: NextFunction): void {
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
    issuedAt: convertUnixTimestampToDateString(user.iat),
    expiresAt: convertUnixTimestampToDateString(user.exp),
  };

  next();
}
