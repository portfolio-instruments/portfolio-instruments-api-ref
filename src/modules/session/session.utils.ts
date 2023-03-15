import * as jwt from 'jsonwebtoken';

export interface VerifiedJwt<T> {
  valid: boolean;
  expired: boolean;
  decoded: T | null;
}

export function signJwt(payload: Object, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn });
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
