import { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { nonNullProp } from '../../utils/nonNull';
import { validateUser } from '../user/user.service';
import { createSessionHypermediaResponse } from './session.hypermedia';
import { CreateSessionContext, CreateSessionRequest } from './session.schema';
import { signJwt } from './session.utils';

export async function createUserSessionHandler(req: CreateSessionRequest & Request, res: Response, next: NextFunction): Promise<void> {
  const sessionContext: CreateSessionContext = req.body;
  const user: Partial<User> | null = await validateUser(sessionContext.email, sessionContext.password);
  if (!user) {
    next(ApiError.unauthorized('Invalid email and password combination'));
    return;
  }

  const jwtToken: string = signJwt(user, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'), '2h');
  res.status(201).json(createSessionHypermediaResponse(jwtToken));
}

export default { createUserSessionHandler };
