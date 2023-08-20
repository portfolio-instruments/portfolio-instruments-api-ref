import type { Prisma, Settings, User } from '@prisma/client';
import type { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';
import { omit } from 'lodash';

/** Create */
export type CreateUserContext = Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export async function createUser(context: CreateUserContext): Promise<User> {
  return await prisma.user.create({ data: context });
}

export function createUserSettings(userId: number): Promise<Settings> {
  return prisma.settings.create({ data: { userId } });
}

/** Read */
export function getUsers(email?: string, options?: ParsedQuery): Promise<User[]> {
  return prisma.user.findMany<Prisma.UserFindManyArgs>({
    where: { email },
    include: {
      Settings: !!options?.expand,
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

export function getUserById(userId: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: userId } });
}

export function getUserSettingsById(userId: number): Promise<Settings | null> {
  return prisma.settings.findUnique({ where: { userId } });
}

/** Update */
type UpdateUserSettingsByIdContext = Partial<Pick<Settings, 'rebalanceThresholdPercent' | 'vpThresholdPercent'>> & { userId: number };

export function updateUserSettingsById(context: UpdateUserSettingsByIdContext): Promise<Settings> {
  return prisma.settings.update({
    where: { userId: context.userId },
    data: omit(context, 'userId'),
  });
}

/** Delete */
export async function deleteUserById(userId: number): Promise<void> {
  await prisma.settings.delete({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
}
