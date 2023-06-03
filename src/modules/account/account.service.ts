import { CreateAccountContext } from './account.request.schema';
import prisma from '../../utils/prisma';
import { Account, Prisma } from '@prisma/client';
import { ParsedQuery } from '../../utils/parseQuery';

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
