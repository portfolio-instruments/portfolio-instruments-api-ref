import type { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { getUserByEmail } from '../user/user.service';
import ApiError from '../../errors/ApiError';
import { nonNullProp } from '../../utils/nonNull';
import { signJwt } from './session.utils';
import config from '../../config';

/** Create */
export type CreateSessionContext = { email: string; password: string; expiresIn: '15m' | '30m' | '1h' | '2h' | '1d' };

export async function createSession(context: CreateSessionContext): Promise<string> {
  const user: Omit<User, 'password'> | null = await validateUser(context.email, context.password);
  if (!user) {
    throw ApiError.unauthorized('Invalid email and password combination');
  }

  return signJwt(user, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'), context.expiresIn);
}

export async function validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
  const user: User | null = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return omit(user, ['password']);
}
