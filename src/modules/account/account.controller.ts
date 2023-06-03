import type { Request, Response } from 'express';
import {
  queryAbleAccountKeys,
  type CreateAccountRequest,
  type GetAccountRequest,
  EditAccountRequest,
  DeleteAccountRequest,
} from './account.request.schema';
import {
  CreateAccountContext,
  EditAccountContext,
  createAccount,
  deleteAccount,
  editAccount,
  getAccountById,
  getAllAccounts,
} from './account.service';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { nonNullValue } from '../../utils/nonNull';
import { Account } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';

type GetAccountsHandlerRequest = Request & ValidUserRequest;

async function getAccountsHandler(req: GetAccountsHandlerRequest, res: Response): Promise<void> {
  const parsedQuery: ParsedQuery = parseQuery(req, queryAbleAccountKeys);
  const userId: number = nonNullValue(req.user?.id);
  const accounts: Account[] = await getAllAccounts(userId, parsedQuery);
  res.status(200).json(accounts);
}

type GetAccountByIdHandlerRequest = Request & ValidUserRequest & GetAccountRequest;

async function getAccountByIdHandler(req: GetAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountId: number = Number(req.params.accountId);

  const account: Account | null = await getAccountById(userId, accountId);
  if (!account) {
    throw ApiError.notFound(`Account with id "${accountId}" not found for the logged in user.`);
  }

  res.status(200).json(account);
}

type CreateAccountHandlerRequest = Request & ValidUserRequest & CreateAccountRequest;

async function createAccountHandler(req: CreateAccountHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountContext: CreateAccountContext = {
    ...(req.body as CreateAccountRequest['body']),
    userId,
  };
  const account: Account = await createAccount(accountContext);
  res.status(201).json(account);
}

type EditAccountByIdHandlerRequest = Request & ValidUserRequest & EditAccountRequest;

async function editAccountByIdHandler(req: EditAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountContext: EditAccountContext = {
    ...(req.body as EditAccountRequest['body']),
    accountId: Number(req.params.accountId),
    userId,
  };
  await editAccount(accountContext);
  // See `editAccount` service implemenation, nothing to return so we send 204 No Content
  res.status(204).json();
}

type DeleteAccountByIdHandlerRequest = Request & ValidUserRequest & DeleteAccountRequest;

async function deleteAccountByIdHandler(req: DeleteAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountId: number = Number(req.params.accountId);
  await deleteAccount(userId, accountId);
  res.status(204).json();
}

export default { getAccountsHandler, getAccountByIdHandler, createAccountHandler, editAccountByIdHandler, deleteAccountByIdHandler };
