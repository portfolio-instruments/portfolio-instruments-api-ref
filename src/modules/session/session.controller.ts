import type { Response } from 'express';
import { type CreateSessionContext, createSession } from './session.service';
import type { BaseRequest } from '../../BaseRequest';
import type { CreateSessionRequest } from './session.request.schema';
import type { ValidUser, ValidUserRequest } from '../../middleware/deserializeUser';
import { getUserByEmail } from '../user/user.service';
import type { User } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import { nonNullValue } from '../../utils/nonNull';

/** Create */
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateSessionResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *        expiresIn:
 *          type: string
 */
type CreateUserSessionHandlerRequest = BaseRequest & CreateSessionRequest;

export async function createUserSessionHandler(req: CreateUserSessionHandlerRequest, res: Response): Promise<void> {
  const expiresIn = '2h' as const;
  const sessionContext: CreateSessionContext = { ...req.body, expiresIn };
  const jwtToken: string = await createSession(sessionContext);

  res.status(201).json({
    accessToken: jwtToken,
    expiresIn,
    // Todo: Refresh token
  });
}

/** Read */
/**
 * @openapi
 * components:
 *  schemas:
 *    GetSessionResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        role:
 *          type: string
 *        issuedAt:
 *          type: string
 *        expiresAt:
 *          type: string
 */
type GetUserSessionHandlerRequest = BaseRequest & ValidUserRequest;

export async function getUserSessionHandler(req: GetUserSessionHandlerRequest, res: Response): Promise<void> {
  const reqUser: ValidUser = nonNullValue(req.user);
  const user: User | null = await getUserByEmail(reqUser.email);
  if (!user) {
    throw ApiError.notFound('User with this session does not exist.');
  }

  res.status(200).json({
    id: reqUser.id,
    name: reqUser.name,
    email: reqUser.email,
    role: reqUser.role,
    issuedAt: reqUser.issuedAt,
    expiresAt: reqUser.expiresAt,
  });
}

export default { createUserSessionHandler, getUserSessionHandler };
