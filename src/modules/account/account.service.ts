import prisma from '../../utils/prisma';
import type { Account, Prisma } from '@prisma/client';
import type { ParsedQuery } from '../../utils/parseQuery';
import { omit } from 'lodash';
import ApiError from '../../errors/ApiError';

/** Create */
export type CreateAccountContext = Omit<Account, 'id' | 'active' | 'createdAt' | 'updatedAt'> & { active?: boolean } & { userId: number };

export async function createAccount(createAccountContext: CreateAccountContext): Promise<Account> {
  return await prisma.account.create({ data: createAccountContext });
}

/** Read */
export type GetAccountsContext = { userId: number; options?: ParsedQuery };

export async function getAccounts(context: GetAccountsContext): Promise<Account[]> {
  return await prisma.account.findMany<Prisma.AccountFindManyArgs>({
    where: { userId: context.userId },
    take: context.options?.take,
    skip: context.options?.skip,
    cursor: context.options?.cursor,
    orderBy: context.options?.sort,
  });
}

export type GetAccountByIdContext = { userId: number; accountId: number };

export async function getAccountById(context: GetAccountByIdContext): Promise<Account | null> {
  return await prisma.account.findFirst({ where: { id: context.accountId, userId: context.userId } });
}

/**
 * Update
 *
 * Prisma's update command doesn't seem to work for multiple where conditions..
 * We are forced to use `updateMany` to accomplish this so that we are able to prevent
 * users from updating accounts across user boundaries.
 *
 * The return for the batch is the number of records updated - not especially helpful
 * to return this value to the user, so just return void.
 */
export type UpdateAccountContext = Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>> & { accountId: number; userId: number };

export async function updateAccount(context: UpdateAccountContext): Promise<void> {
  const updated = await prisma.account.updateMany<Prisma.AccountUpdateManyArgs>({
    where: {
      AND: [{ id: context.accountId }, { userId: context.userId }],
    },
    data: omit(context, 'accountId'),
  });

  if (updated.count === 0) {
    throw ApiError.notFound(`Account with id "${context.accountId}" not found for the logged in user.`);
  }
}

/**
 * Delete
 *
 * Same issue as editAccount - we need to use `deleteMany` to prevent users from deleting accounts
 * across user boundaries.
 */
export type DeleteAccountContext = { userId: number; accountId: number };

export async function deleteAccount(context: DeleteAccountContext): Promise<void> {
  const deleted = await prisma.account.deleteMany<Prisma.AccountDeleteManyArgs>({
    where: {
      AND: [{ id: context.accountId }, { userId: context.userId }],
    },
  });

  if (deleted.count === 0) {
    throw ApiError.notFound(`Account with id "${context.accountId}" not found for the logged in user.`);
  }
}
