import { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { createUserHypermediaResponse } from './user.hypermedia';
import { CreateUserContext, CreateUserRequest, userKeys } from './user.schema';
import { createUser, getAllUsers, getUser } from './user.service';
import { parseCreateUser } from './user.utils';

async function getAllUsersHandler(req: Request, res: Response): Promise<void> {
  const parsedQuery: ParsedQuery = parseQuery(req, userKeys);
  const users: User[] = await getAllUsers(parsedQuery);
  res.status(200).json(users);
}

async function createUserHandler(req: CreateUserRequest & Request, res: Response, next: NextFunction): Promise<void> {
  const userContext: CreateUserContext = parseCreateUser(req);
  const userAlreadyExists: boolean = !!(await getUser(userContext.email));
  if (userAlreadyExists) {
    next(ApiError.conflict('A user with this email already exists'));
    return;
  }

  const user: User = await createUser(userContext);
  res.status(201).json(createUserHypermediaResponse(user));
}

export default { getAllUsersHandler, createUserHandler };
