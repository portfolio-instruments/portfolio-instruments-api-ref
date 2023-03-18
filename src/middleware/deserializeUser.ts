import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { VerifiedJwt, verifyJwt } from '../modules/session/session.utils';
import { nonNullProp } from '../utils/nonNull';

export interface ValidUserRequest {
  locals: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

export default function deserializeUser(req: ValidUserRequest & Request, __: Response, next: NextFunction): void {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '');

  if (!accessToken) {
    next();
    return;
  }

  const jwtResponse: VerifiedJwt<User> = verifyJwt(accessToken, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'));
  const user: User = nonNullProp(jwtResponse, 'decoded');

  req.locals.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  next();
}
