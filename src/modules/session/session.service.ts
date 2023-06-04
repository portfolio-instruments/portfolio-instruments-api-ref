import type { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { getUserByEmail } from '../user/user.service';

// Change the pattern for creating and validating a session...
// Maybe call it "get session" and call the helper "validate session"?
export async function validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
  const user: User | null = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return omit(user, ['password']);
}
