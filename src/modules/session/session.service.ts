import type { User } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import { nonNullProp } from '../../utils/nonNull';
import { signJwt, validateCredentials } from './session.utils';
import config from '../../config';

/** Create */
export type CreateSessionContext = { email: string; password: string; expiresIn: '15m' | '30m' | '1h' | '2h' | '1d' };

export async function createSession(context: CreateSessionContext): Promise<string> {
  const user: Omit<User, 'password'> | null = await validateCredentials(context.email, context.password);
  if (!user) {
    throw ApiError.unauthorized('Invalid email and password combination');
  }

  return signJwt(user, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'), context.expiresIn);
}
