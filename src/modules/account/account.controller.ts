import type { Request, Response } from 'express';
import type { PatchAccountRequest, DeleteAccountRequest, PutAccountRequest } from './account.request.schema';
import { queryAbleAccountKeys, type CreateAccountRequest, type GetAccountRequest } from './account.request.schema';
import type { CreateAccountContext, UpdateAccountContext } from './account.service';
import { createAccount, deleteAccount, updateAccount, getAccountById, getAccounts } from './account.service';
import type { ValidUserRequest } from '../../middleware/deserializeUser';
import { nonNullValue } from '../../utils/nonNull';
import type { Account } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import type { ParsedQuery } from '../../utils/parseQuery';
import { parseQuery } from '../../utils/parseQuery';
import type { BaseRequest } from '../../IBaseRequest';

/** Create */
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateAccountResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        userId:
 *          type: number
 *        institution:
 *          type: string
 *        taxShelter:
 *          type: string
 *        description:
 *          type: string
 *        active:
 *          type: boolean
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
type CreateAccountHandlerRequest = BaseRequest & ValidUserRequest & CreateAccountRequest;

async function createAccountHandler(req: CreateAccountHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const context: CreateAccountContext = { ...req.body, userId };
  const account: Account = await createAccount(context);
  res.status(201).json(account);
}

/** Read */
type GetAccountsHandlerRequest = Request & ValidUserRequest;

async function getAccountsHandler(req: GetAccountsHandlerRequest, res: Response): Promise<void> {
  const parsedQuery: ParsedQuery = parseQuery(req, queryAbleAccountKeys);
  const userId: number = nonNullValue(req.user?.id);
  const accounts: Account[] = await getAccounts(userId, parsedQuery);
  res.status(200).json(accounts);
}

type GetAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & GetAccountRequest;

async function getAccountByIdHandler(req: GetAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountId: number = Number(req.params.accountId);

  const account: Account | null = await getAccountById(userId, accountId);
  if (!account) {
    throw ApiError.notFound(`Account with id "${accountId}" not found for the logged in user.`);
  }

  res.status(200).json(account);
}

/** Update */
type PatchAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & PatchAccountRequest;
type PutAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & PutAccountRequest;
type UpdateAccountByIdHandlerRequest = PatchAccountByIdHandlerRequest | PutAccountByIdHandlerRequest;

async function updateAccountByIdHandler(req: UpdateAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const context: UpdateAccountContext = {
    ...req.body,
    accountId: Number(req.params.accountId),
    userId,
  };
  await updateAccount(context);
  res.status(204).json();
}

/** Delete */
type DeleteAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & DeleteAccountRequest;

async function deleteAccountByIdHandler(req: DeleteAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountId: number = Number(req.params.accountId);
  await deleteAccount(userId, accountId);
  res.status(204).json();
}

export default {
  getAccountsHandler,
  getAccountByIdHandler,
  createAccountHandler,
  updateAccountByIdHandler,
  deleteAccountByIdHandler,
};
