import { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { CreateUserContext, CreateUserRequest, userKeys } from './user.schema';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { createUser, getAllUsers } from './user.service';
import { parseCreateUser } from './user.utils';
import { createUserHypermediaResponse } from './user.hypermedia';

async function getAllUsersHandler(req: Request, res: Response): Promise<void> {
    const parsedQuery: ParsedQuery = parseQuery(req, userKeys);
    const users: User[] = await getAllUsers(parsedQuery);
    res.json(users);
}

async function createUserHandler(req: CreateUserRequest & Request, res: Response): Promise<void> {
    const userContext: CreateUserContext = parseCreateUser(req);
    const user: User = await createUser(userContext);
    res.status(201).json(createUserHypermediaResponse(user));
}

export default { getAllUsersHandler, createUserHandler };