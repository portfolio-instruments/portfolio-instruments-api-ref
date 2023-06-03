import { CreateAccountContext } from './account.request.schema';
import prisma from '../../utils/prisma';
import { Account, Prisma } from '@prisma/client';
import { ParsedQuery } from '../../utils/parseQuery';
import { omit } from 'lodash';

export type EditAccountContext = Partial<Omit<Account, 'createdAt' | 'updatedAt'>> & { accountId: number; userId: number };

/**
 * Prisma's update command doesn't seem to work for multiple where conditions..
 * We are forced to use `updateMany` to accomplish this so that we are able to prevent
 * users from updating accounts across user boundaries.
 *
 * The return for the batch is the number of records updated - not especially helpful
 * to return this value to the user, so just return void.
 */
export async function editAccount(editAccountContext: EditAccountContext): Promise<void> {
  await prisma.account.updateMany<Prisma.AccountUpdateManyArgs>({
    where: {
      AND: [{ id: editAccountContext.accountId }, { userId: editAccountContext.userId }],
    },
    data: omit(editAccountContext, 'accountId'),
  });
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

export type NewAccount = CreateAccountContext & { userId: number };

export async function createAccount(newAccount: NewAccount): Promise<Account> {
  return await prisma.account.create({ data: newAccount });
}

export default { createAccount };
