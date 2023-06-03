import type { Request, Response } from 'express';
import { queryAbleAccountKeys, type CreateAccountContext, type CreateAccountRequest, type GetAccountRequest } from './account.request.schema';
import { createAccount, getAccountById, getAllAccounts } from './account.service';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { nonNullValue } from '../../utils/nonNull';
import { Account } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';

type GetAccountsHandlerRequest = Request & ValidUserRequest;

async function getAccountsHandler(req: GetAccountsHandlerRequest, res: Response): Promise<void> {
  const parsedQuery: ParsedQuery = parseQuery(req, queryAbleAccountKeys);
  const userId: number = nonNullValue(req.locals?.user?.id);
  const accounts: Account[] = await getAllAccounts(userId, parsedQuery);
  res.status(200).json(accounts);
}

type GetAccountByIdHandlerRequest = Request & ValidUserRequest & GetAccountRequest;

async function getAccountByIdHandler(req: GetAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.locals?.user?.id);
  const accountId: number = Number(req.params.accountId);

  const account: Account | null = await getAccountById(userId, accountId);
  if (!account) {
    throw ApiError.notFound(`Account with id "${accountId}" not found for the logged in user.`);
  }

  res.status(200).json(account);
}

type CreateAccountHandlerRequest = Request & ValidUserRequest & CreateAccountRequest;

async function createAccountHandler(req: CreateAccountHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.locals?.user?.id);
  const accountContext: CreateAccountContext = req.body as CreateAccountContext;
  const account: Account = await createAccount({ ...accountContext, userId });
  res.status(201).json(account);
}

export default { createAccountHandler, getAllAccountsHandler: getAccountsHandler, getAccountByIdHandler };
