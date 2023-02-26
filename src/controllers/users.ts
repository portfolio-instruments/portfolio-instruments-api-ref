import { Prisma, User } from '@prisma/client';
import type { Response } from 'express';
import { RequestWithQueryValidation, ValidatedQueryParams } from '../middleware/validateQuery';
import { getSortingOptions, SortingOption } from '../utils/sortingUtils';
import prisma from '../configs/prismaClient';

const tempUser = {
  id: 1,
  name: 'Matt',
};

const readAllUsers = async (req: RequestWithQueryValidation, res: Response) => {
    const { skip, take, cursor, sort } = req.vQuery as ValidatedQueryParams;
    const sortingOptions: SortingOption<User>[] | undefined = sort ? getSortingOptions(req, tempUser) : undefined;
    // which fields to include in the return

    const users: User[] = await prisma.user.findMany<Prisma.UserFindManyArgs>({
      take,
      skip,
      cursor,
      orderBy: sortingOptions,
    });

    res.json(users);
}

export default { readAllUsers };