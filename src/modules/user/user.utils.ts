import bcrypt from 'bcryptjs';
import config from '../../config';
import { CreateUserRequest } from './schema/user.request.schema';
import { NewUser } from './schema/user.db.schema';

export function parseCreateUser(req: CreateUserRequest): NewUser {
  const { email, name, password } = req.body;
  const hashedPassword: string = hashPassword(password);
  return { email, name, password: hashedPassword };
}

export function hashPassword(password: string): string {
  const salt: string = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
