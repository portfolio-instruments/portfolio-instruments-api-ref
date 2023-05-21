import { Prisma, Settings, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import ApiError from '../../errors/ApiError';
import { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';
import { CreateUserContext } from './user.schema';

export function getUser(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function getAllUsers(options?: ParsedQuery & { email?: string }): Promise<User[]> {
  return prisma.user.findMany<Prisma.UserFindManyArgs>({
    where: {
      email: options?.email,
    },
    include: {
      settings: options?.expand === 'settings',
    },
    take: options?.take,
    skip: options?.skip,
    cursor: options?.cursor,
    orderBy: options?.sort,
  });
}

/**
 * @throws 409 conflict error if user already exists
 */
export async function createUser(user: CreateUserContext): Promise<User> {
  try {
    return await prisma.user.create({ data: user });
  } catch (e: any) {
    // If the error indicates a user already exists, attempt to re-throw a cleaner conflict error
    const regex: RegExp = /Unique constraint failed on the fields:\s*\((?:[^()]*\bemail\b[^()]*)\)/i;
    if (regex.test(e.message ?? '')) {
      throw ApiError.conflict('A user with this email already exists');
    }
    throw e;
  }
}

export function createUserSettings(userId: number): Promise<Settings> {
  return prisma.settings.create({ data: { userId } });
}

export async function validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
  const user: User | null = await prisma.user.findFirst({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return omit(user, ['password']);
}
