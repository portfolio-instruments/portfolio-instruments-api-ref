import { Prisma, Settings, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';

export function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function getUsers(email?: string, options?: ParsedQuery): Promise<User[]> {
  return prisma.user.findMany<Prisma.UserFindManyArgs>({
    where: { email },
    include: {
      settings: options?.expand === 'settings',
    },
    take: options?.take,
    skip: options?.skip,
    cursor: options?.cursor,
    orderBy: options?.sort,
  });
}

export type CreateUserContext = Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export async function createUser(createUserContext: CreateUserContext): Promise<User> {
  return await prisma.user.create({ data: createUserContext });
}

export function createUserSettings(userId: number): Promise<Settings> {
  return prisma.settings.create({ data: { userId } });
}

export async function validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
  const user: User | null = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return omit(user, ['password']);
}
