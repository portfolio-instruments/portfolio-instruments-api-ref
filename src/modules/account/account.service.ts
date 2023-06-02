import { CreateAccountContext } from './account.schema';
import prisma from '../../utils/prisma';
import { Account } from '@prisma/client';

export async function getAllAccounts(userId: number): Promise<Account[]> {
  return await prisma.account.findMany({ where: { userId } });
}

export type NewAccount = CreateAccountContext & { userId: number };

export async function createAccount(newAccount: NewAccount): Promise<Account> {
  return await prisma.account.create({ data: newAccount });
}

export default { createAccount };
