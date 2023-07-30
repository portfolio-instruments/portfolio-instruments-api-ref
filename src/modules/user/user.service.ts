import type { Prisma, Settings, User } from '@prisma/client';
import type { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';

/** Create */
export type CreateUserContext = Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export async function createUser(createUserContext: CreateUserContext): Promise<User> {
  return await prisma.user.create({ data: createUserContext });
}

export function createUserSettings(userId: number): Promise<Settings> {
  return prisma.settings.create({ data: { userId } });
}

/** Read */
export function getUsers(email?: string, options?: ParsedQuery): Promise<User[]> {
  return prisma.user.findMany<Prisma.UserFindManyArgs>({
    where: { email },
    include: {
      settings: !!options?.expand,
    },
    select: options?.select,
    take: options?.take,
    skip: options?.skip,
    cursor: options?.cursor,
    orderBy: options?.sort,
  });
}

export function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function getUserSettingsById(userId: number): Promise<Settings | null> {
  return prisma.settings.findUnique({ where: { userId } });
}
