import type { Response } from 'express';
import type { CreateAccountContext, CreateAccountRequest } from './account.schema';
import { createAccount } from './account.service';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { nonNullValue } from '../../utils/nonNull';
import { Account } from '@prisma/client';
import { omit } from 'lodash';

async function createAccountHandler(req: ValidUserRequest & CreateAccountRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.locals?.user?.id);
  const accountContext: CreateAccountContext = req.body as CreateAccountContext;
  const account: Account = await createAccount({ ...accountContext, userId });
  res.status(201).json(omit(account, 'userId'));
}

export default { createAccountHandler };
