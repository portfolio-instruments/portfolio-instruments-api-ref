import { Settings, User } from '@prisma/client';
import type { Request, Response } from 'express';
import { omit } from 'lodash';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { CreateUserContext, CreateUserRequest, userKeys } from './user.schema';
import { createUser, createUserSettings, getAllUsers } from './user.service';
import { parseCreateUser } from './user.utils';

// Add and only allow req.expand on getUserHandler for 'settngs'...

const omitUserValues = ['password', 'role'] as const;
const omitUserSettings = ['id', 'userId'] as const;

async function getAllUsersHandler(req: ValidUserRequest & Request, res: Response): Promise<void> {
  const email: string | undefined = req.locals?.user?.role === 'USER' ? req.locals.user.email : undefined;
  const parsedQuery: ParsedQuery = parseQuery(req, userKeys);
  const users: User[] = await getAllUsers({ ...parsedQuery, email });
  const redactedUsers: Omit<User, 'password' | 'role'>[] = users.map((user) => omit(user, omitUserValues));
  res.status(200).json(redactedUsers);
}

async function createUserHandler(req: CreateUserRequest & Request, res: Response): Promise<void> {
  const userContext: CreateUserContext = parseCreateUser(req);
  const user: User = await createUser(userContext);
  const settings: Settings = await createUserSettings(user.id);
  res.status(201).json({ ...omit(user, 'password'), settings: omit(settings, omitUserSettings) });
}

export default { getAllUsersHandler, createUserHandler };
