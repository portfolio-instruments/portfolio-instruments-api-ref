import bcrypt from 'bcryptjs';
import config from '../../config';

export function hashPassword(password: string): string {
  const salt: string = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
