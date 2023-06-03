import prisma from '../../utils/prisma';
import { Account, Prisma } from '@prisma/client';
import { ParsedQuery } from '../../utils/parseQuery';
import { omit } from 'lodash';
import ApiError from '../../errors/ApiError';

export type EditAccountContext = Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>> & { accountId: number; userId: number };

/**
 * Prisma's update command doesn't seem to work for multiple where conditions..
 * We are forced to use `updateMany` to accomplish this so that we are able to prevent
 * users from updating accounts across user boundaries.
 *
 * The return for the batch is the number of records updated - not especially helpful
 * to return this value to the user, so just return void.
 */
export async function editAccount(editAccountContext: EditAccountContext): Promise<void> {
  const edited = await prisma.account.updateMany<Prisma.AccountUpdateManyArgs>({
    where: {
      AND: [{ id: editAccountContext.accountId }, { userId: editAccountContext.userId }],
    },
    data: omit(editAccountContext, 'accountId'),
  });

  if (edited.count === 0) {
    throw ApiError.notFound(`Account with id "${editAccountContext.accountId}" not found for the logged in user.`);
  }
}

/**
 * Same issue as editAccount - we need to use `deleteMany` to prevent users from deleting accounts
 * across user boundaries.
 */
export async function deleteAccount(userId: number, accountId: number): Promise<void> {
  const deleted = await prisma.account.deleteMany<Prisma.AccountDeleteManyArgs>({
    where: {
      AND: [{ id: accountId }, { userId }],
    },
  });

  if (deleted.count === 0) {
    throw ApiError.notFound(`Account with id "${accountId}" not found for the logged in user.`);
  }
}

export async function getAllAccounts(userId: number, options?: ParsedQuery): Promise<Account[]> {
  return await prisma.account.findMany<Prisma.AccountFindManyArgs>({
    where: { userId },
    take: options?.take,
    skip: options?.skip,
    cursor: options?.cursor,
    orderBy: options?.sort,
  });
}

export async function getAccountById(userId: number, accountId: number): Promise<Account | null> {
  return await prisma.account.findFirst({ where: { id: accountId, userId } });
}

export type CreateAccountContext = Omit<Account, 'id' | 'active' | 'createdAt' | 'updatedAt'> & { active?: boolean } & { userId: number };

export async function createAccount(createAccountContext: CreateAccountContext): Promise<Account> {
  return await prisma.account.create({ data: createAccountContext });
}
