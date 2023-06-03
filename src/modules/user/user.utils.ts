import bcrypt from 'bcryptjs';
import config from '../../config';
import { CreateUserContext, CreateUserRequest } from './user.request.schema';

export function parseCreateUser(req: CreateUserRequest): CreateUserContext {
  const { email, name, password } = req.body;
  const hashedPassword: string = hashPassword(password);
  return { email, name, password: hashedPassword };
}

export function hashPassword(password: string): string {
  const salt: string = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
