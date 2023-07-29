import * as jwt from 'jsonwebtoken';
import { getUserByEmail } from '../user/user.service';
import type { User } from '@prisma/client';
import { omit } from 'lodash';
import * as bcrypt from 'bcryptjs';

export interface VerifiedJwt<T> {
  valid: boolean;
  expired: boolean;
  decoded: (jwt.JwtPayload & T) | null;
}

export function signJwt(payload: Object, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt<T extends object>(token: string, secret: string): VerifiedJwt<T> {
  try {
    const decoded = jwt.verify(token, secret) as T;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: unknown) {
    const err = e as Error;
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    };
  }
}

export async function validateCredentials(email: string, password: string): Promise<Omit<User, 'password'> | null> {
  const user: User | null = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return omit(user, ['password']);
}
