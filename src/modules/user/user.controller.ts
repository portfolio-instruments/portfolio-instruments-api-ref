import { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { CreateUserContext, CreateUserRequest, userKeys } from './user.schema';
import { ParsedQuery, parseQuery } from '../../utils/parseQuery';
import { getAllUsers } from './user.service';
import { parseCreateUser } from './user.utils';
import prisma from '../../utils/prisma';

async function getAllUsersHandler(req: Request, res: Response): Promise<void> {
    const parsedQuery: ParsedQuery = parseQuery(req, userKeys);
    const users: User[] = await getAllUsers(parsedQuery);
    res.json(users);
}

async function createUserHandler(req: CreateUserRequest, res: Response): Promise<void> {
    const userContext: CreateUserContext = parseCreateUser(req);
    const user: User = await prisma.user.create({ data: userContext });
    console.log(res);
    console.log(user);
}

export default { getAllUsersHandler, createUserHandler };