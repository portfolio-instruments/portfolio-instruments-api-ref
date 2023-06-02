import type { Request, Response } from 'express';
import type { CreateAccountContext, CreateAccountRequest } from './account.schema';
import { createAccount, getAllAccounts } from './account.service';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { nonNullValue } from '../../utils/nonNull';
import { Account } from '@prisma/client';

async function getAllAccountsHandler(req: ValidUserRequest & Request, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.locals?.user?.id);
  const accounts: Account[] = await getAllAccounts(userId);
  res.status(200).json(accounts);
}

async function createAccountHandler(req: ValidUserRequest & CreateAccountRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.locals?.user?.id);
  const accountContext: CreateAccountContext = req.body as CreateAccountContext;
  const account: Account = await createAccount({ ...accountContext, userId });
  res.status(201).json(account);
}

export default { createAccountHandler, getAllAccountsHandler };
