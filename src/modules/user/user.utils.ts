import { CreateUserContext, CreateUserRequest } from './user.schema';

export function parseCreateUser(req: CreateUserRequest): CreateUserContext {
  const { email, name, password } = req.body;
  return { email, name, password };
}
