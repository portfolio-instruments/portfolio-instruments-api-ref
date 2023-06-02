import { User as PrismaUser } from '@prisma/client';
import type { Request, Response } from 'express';
import { omit } from 'lodash';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { CreateUserRequest, userKeys } from './schema/user.request.schema';
import { CreatedUser, createUser, createUserSettings, getAllUsers } from './user.service';
import { parseCreateUser } from './user.utils';
import { NewUser, Settings } from './schema/user.db.schema';

// Add and only allow req.expand on getUserHandler for 'settngs'...

const omitUserValues = ['password', 'role'] as const;

async function getAllUsersHandler(req: ValidUserRequest & Request, res: Response): Promise<void> {
  const email: string | undefined = req.locals?.user?.email;
  const parsedQuery: ParsedQuery = parseQuery(req, userKeys);
  const users: PrismaUser[] = await getAllUsers({ ...parsedQuery, email });
  const redactedUsers: Omit<PrismaUser, 'password' | 'role'>[] = users.map((user) => omit(user, omitUserValues));
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
  const newUser: NewUser = parseCreateUser(req);
  const user: CreatedUser = await createUser(newUser);
  const settings: Settings = await createUserSettings({ userId: user.id });
  res.status(201).json({ ...user, settings: { vpThreshold: settings.vpThreshold, rebalanceThreshold: settings.rebalanceThreshold } });
}

export default { getAllUsersHandler, createUserHandler };
