import { Prisma, User } from '@prisma/client';
import { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';
import { CreateUserContext } from './user.schema';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';

export function getAllUsers(options?: ParsedQuery): Promise<User[]> {
  return prisma.user.findMany<Prisma.UserFindManyArgs>({
    take: options?.take,
    skip: options?.skip,
    cursor: options?.cursor,
    orderBy: options?.sort,
  });
}

export function createUser(user: CreateUserContext): Promise<User> {
  return prisma.user.create({ data: user });
}

export async function validateUserPassword(email: string, password: string): Promise<Partial<User> | null> {
  const user: User | null = await prisma.user.findFirst({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return null;
  }
  return omit(user, ['password']);
}