import { hashPassword } from '../../utils/authUtils';
import { CreateUserContext, CreateUserRequest } from './user.schema';

export function parseCreateUser(req: CreateUserRequest): CreateUserContext {
  const { email, name, password } = req.body;
  const hashedPassword: string = hashPassword(password);
  return { email, name, password: hashedPassword };
}
