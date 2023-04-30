import { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { nonNullProp } from '../../utils/nonNull';
import { validateUser } from '../user/user.service';
import { CreateSessionContext, CreateSessionRequest } from './session.schema';
import { signJwt } from './session.utils';

export async function createUserSessionHandler(req: CreateSessionRequest & Request, res: Response, next: NextFunction): Promise<void> {
  const sessionContext: CreateSessionContext = req.body;
  const user: Partial<User> | null = await validateUser(sessionContext.email, sessionContext.password);
  if (!user) {
    next(ApiError.unauthorized('Invalid email and password combination'));
    return;
  }

  const expiresIn: string = '2h';
  const jwtToken: string = signJwt(user, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'), expiresIn);
  res.status(201).json({
    token: jwtToken,
    expiresIn,
    // Todo: Refresh token
  });
}

export default { createUserSessionHandler };
