import { Settings, User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { expandEmptyFields } from '../../utils/expandEmptyFields';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { createUserHypermediaResponse, createUserSettingsHypermediaComponent, getUsersHypermediaResponse } from './user.hypermedia';
import { CreateUserContext, CreateUserRequest, userKeys } from './user.schema';
import { createUser, createUserSettings, getAllUsers, getUser } from './user.service';
import { parseCreateUser } from './user.utils';

async function getAllUsersHandler(req: ValidUserRequest & Request, res: Response): Promise<void> {
  const email: string | undefined = req.locals?.user?.role === 'USER' ? req.locals.user.email : undefined;
  const parsedQuery: ParsedQuery = parseQuery(req, userKeys);
  const users: User[] = await getAllUsers({ ...parsedQuery, email });
  const expandedUsers = users.map((user) => {
    return expandEmptyFields(user, [{ fields: 'settings', hrefs: createUserSettingsHypermediaComponent(user.id).href }]);
  });
  res.status(200).json(getUsersHypermediaResponse(expandedUsers));
}

async function createUserHandler(req: CreateUserRequest & Request, res: Response, next: NextFunction): Promise<void> {
  const userContext: CreateUserContext = parseCreateUser(req);
  const userAlreadyExists: boolean = !!(await getUser(userContext.email));
  if (userAlreadyExists) {
    next(ApiError.conflict('A user with this email already exists'));
    return;
  }

  const user: User = await createUser(userContext);
  const settings: Settings = await createUserSettings(user.id);
  res.status(201).json(createUserHypermediaResponse(user, settings));
}

export default { getAllUsersHandler, createUserHandler };
