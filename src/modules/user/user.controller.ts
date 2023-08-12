import type { Settings, User } from '@prisma/client';
import type { Response } from 'express';
import { omit } from 'lodash';
import type { ValidUser, ValidUserRequest } from '../../middleware/deserializeUser';
import type { ParsedQuery } from '../../utils/parseQuery';
import { parseQuery } from '../../utils/parseQuery';
import type {
  CreateUserRequest,
  GetUserByIdRequest,
  GetUserSettingsByIdRequest,
  PatchUserSettingsByIdRequest,
  PutUserSettingsByIdRequest,
} from './user.request.schema';
import { queryAbleUserKeys } from './user.request.schema';
import type { CreateUserContext } from './user.service';
import { getUserByEmail, getUserSettingsById, updateUserSettingsById } from './user.service';
import { createUser, createUserSettings, getUsers } from './user.service';
import ApiError from '../../errors/ApiError';
import type { BaseRequest } from '../../BaseRequest';
import { hashPassword } from './user.utils';
import { nonNullValue } from '../../utils/nonNull';

/** Create */
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        role:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
type CreateUserHandlerRequest = BaseRequest & CreateUserRequest;

async function createUserHandler(req: CreateUserHandlerRequest, res: Response): Promise<void> {
  const createUserContext: CreateUserContext = { ...omit(req.body, 'confirmPassword'), password: hashPassword(req.body.password) };

  try {
    const user: User = await createUser(createUserContext);
    const settings: Settings = await createUserSettings(user.id);
    res.status(201).json({ ...omit(user, 'password'), settings: omit(settings, ['id', 'userId', 'createdAt', 'updatedAt']) });
  } catch (e) {
    const err = e as Error;
    const regex: RegExp = /Unique constraint failed on the fields:\s*\((?:[^()]*\bemail\b[^()]*)\)/i;

    // If the error indicates a user already exists, attempt to re-throw a cleaner conflict error
    if (regex.test(err?.message ?? '')) {
      throw ApiError.conflict('A user with this email already exists');
    }

    throw err;
  }
}

/** Read */
type GetUsersHandlerRequest = BaseRequest & ValidUserRequest;

async function getUsersHandler(req: GetUsersHandlerRequest, res: Response): Promise<void> {
  const email: string | undefined = req.user?.role === 'USER' ? req.user.email : undefined;
  const parsedQuery: ParsedQuery = parseQuery(req, queryAbleUserKeys);
  const users: User[] = await getUsers(email, parsedQuery);
  const redactedUsers: Omit<User, 'password'>[] = users.map((user) => omit(user, 'password'));
  res.status(200).json(redactedUsers);
}

/**
 * @openapi
 * components:
 *  schemas:
 *    GetUserResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        role:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
type GetUserByIdHandlerRequest = BaseRequest & ValidUserRequest & GetUserByIdRequest;

async function getUserByIdHandler(req: GetUserByIdHandlerRequest, res: Response): Promise<void> {
  const userReq: ValidUser = nonNullValue(req.user);
  const userId: number = Number(req.params.userId);

  if (userReq.id !== userId) {
    throw ApiError.forbidden('You are not authorized to access this resource.');
  }

  const user: User | null = await getUserByEmail(userReq.email);
  if (!user) {
    ApiError.notFound('User not found.');
  }

  const redactedUser: Omit<User, 'password'> = omit(user, 'password');
  res.status(200).json(redactedUser);
}

/**
 * @openapi
 * components:
 *  schemas:
 *    GetUserSettingsResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        vpThresholdPercent:
 *          type: number
 *        rebalanceThresholdPercent:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
type GetUserSettingsByIdHandlerRequest = BaseRequest & ValidUserRequest & GetUserSettingsByIdRequest;

async function getUserSettingsByIdHandler(req: GetUserSettingsByIdHandlerRequest, res: Response): Promise<void> {
  const user: ValidUser = nonNullValue(req.user);
  const userId: number = Number(req.params.userId);

  if (user.id !== userId) {
    throw ApiError.forbidden('You are not authorized to access this resource.');
  }

  const settings: Settings | null = await getUserSettingsById(userId);
  if (!settings) {
    throw ApiError.notFound('User settings not found.');
  }

  res.status(200).json(omit(settings, 'userId'));
}

/** Update */
/**
 * @openapi
 * components:
 *  schemas:
 *    PutUserSettingsResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        vpThresholdPercent:
 *          type: string
 *        rebalanceThresholdPercent:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
type PutUserSettingsByIdHandlerRequest = BaseRequest & ValidUserRequest & PutUserSettingsByIdRequest;

type PatchUserSettingsByIdHandlerRequest = BaseRequest & ValidUserRequest & PatchUserSettingsByIdRequest;

type UpdateUserSettingsByIdHandlerRequest = PutUserSettingsByIdHandlerRequest | PatchUserSettingsByIdHandlerRequest;

async function updateUserSettingsByIdHandler(req: UpdateUserSettingsByIdHandlerRequest, res: Response): Promise<void> {
  const user: ValidUser = nonNullValue(req.user);
  const userId: number = Number(req.params.userId);

  if (user.id !== userId) {
    throw ApiError.forbidden('You are not authorized to access this resource.');
  }

  const settings: Settings | null = await updateUserSettingsById({ ...req.body, userId });
  if (!settings) {
    throw ApiError.notFound('User settings not found.');
  }

  res.status(200).json(omit(settings, 'userId'));
}

export default { getUsersHandler, getUserByIdHandler, getUserSettingsByIdHandler, createUserHandler, updateUserSettingsByIdHandler };
