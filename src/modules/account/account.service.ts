import { CreateAccountContext } from './account.request.schema';
import prisma from '../../utils/prisma';
import { Account } from '@prisma/client';

export async function getAllAccounts(userId: number): Promise<Account[]> {
  return await prisma.account.findMany({ where: { userId } });
}

export async function getAccountById(userId: number, accountId: number): Promise<Account | null> {
  return await prisma.account.findFirst({ where: { id: accountId, userId } });
}

export type NewAccount = CreateAccountContext & { userId: number };

export async function createAccount(newAccount: NewAccount): Promise<Account> {
  return await prisma.account.create({ data: newAccount });
}

export default { createAccount };
