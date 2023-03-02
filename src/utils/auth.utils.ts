import * as jwt from 'jsonwebtoken';
import config from '../config';
import bcrypt from 'bcryptjs';

export interface VerifiedJwt<T> {
  valid: boolean;
  expired: boolean;
  decoded: T | null;
}

export function createJwt(payload: Object, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { algorithm: 'RS256', expiresIn });
}

export function verifyJwt<T extends jwt.JwtPayload>(token: string, secret: string): VerifiedJwt<T> {
  try {
    const decoded = jwt.verify(token, secret) as T;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    };
  }
}

export function hashPassword(password: string): string {
  const salt: string = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
