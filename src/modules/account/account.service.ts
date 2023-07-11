import prisma from '../../utils/prisma';
import type { Account, Prisma } from '@prisma/client';
import type { ParsedQuery } from '../../utils/parseQuery';
import { omit } from 'lodash';

/** Create */
export type CreateAccountContext = Omit<Account, 'id' | 'active' | 'createdAt' | 'updatedAt'> & { active?: boolean } & { userId: number };

export async function createAccount(createAccountContext: CreateAccountContext): Promise<Account> {
  return await prisma.account.create({ data: createAccountContext });
}

/** Read */
export async function getAccounts(userId: number, options?: ParsedQuery): Promise<Account[]> {
  return await prisma.account.findMany<Prisma.AccountFindManyArgs>({
    where: {
      userId: !options?.filter.AND ? userId : undefined,
      AND: options?.filter.AND ? options.filter.AND?.concat({ userId }) : undefined,
      createdAt: {
        gte: options?.filter.startDate,
        lte: options?.filter.endDate,
      },
    },
    select: options?.select,
    take: options?.take,
    skip: options?.skip,
    cursor: options?.cursor,
    orderBy: options?.sort,
  });
}

export async function getAccountById(userId: number, accountId: number): Promise<Account | null> {
  return await prisma.account.findFirst({ where: { id: accountId, userId } });
}

/** Update */
export type UpdateAccountContext = Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>> & { id: number };

export async function updateAccount(context: UpdateAccountContext): Promise<Account> {
  return await prisma.account.update<Prisma.AccountUpdateArgs>({
    where: { id: context.id },
    data: omit(context, 'id'),
  });
}

/** Delete */
export async function deleteAccount(accountId: number): Promise<void> {
  await prisma.account.delete<Prisma.AccountDeleteArgs>({
    where: { id: accountId },
  });
}
