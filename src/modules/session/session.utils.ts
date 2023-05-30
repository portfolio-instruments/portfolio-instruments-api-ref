import * as jwt from 'jsonwebtoken';

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
