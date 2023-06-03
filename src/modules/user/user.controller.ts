import { Settings, User } from '@prisma/client';
import type { Request, Response } from 'express';
import { omit } from 'lodash';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { CreateUserContext, CreateUserRequest, queryAbleUserKeys } from './user.request.schema';
import { createUser, createUserSettings, getAllUsers } from './user.service';
import { parseCreateUser } from './user.utils';
import ApiError from '../../errors/ApiError';

// Add and only allow req.expand on getUserHandler for 'settngs'...

async function getAllUsersHandler(req: ValidUserRequest & Request, res: Response): Promise<void> {
  const email: string | undefined = req.locals?.user?.role === 'USER' ? req.locals.user.email : undefined;
  const parsedQuery: ParsedQuery = parseQuery(req, queryAbleUserKeys);
  const users: User[] = await getAllUsers({ ...parsedQuery, email });
  const redactedUsers: Omit<User, 'password' | 'role'>[] = users.map((user) => omit(user, ['password', 'role']));
  res.status(200).json(redactedUsers);
}

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
async function createUserHandler(req: CreateUserRequest & Request, res: Response): Promise<void> {
  const userContext: CreateUserContext = parseCreateUser(req);
  try {
    const user: User = await createUser(userContext);
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

export default { getAllUsersHandler, createUserHandler };
