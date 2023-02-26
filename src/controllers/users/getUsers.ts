import type { Prisma, User } from "@prisma/client";
import type { NextFunction, Response } from "express";
import { RequestWithQueryValidation, ValidatedQueryParams } from "../../middleware/RequestWithQueryValidation";
import { getSortingOptions, SortingOption } from "../../utils/sortingUtils";
import prisma from '../../configs/prismaClient';

const tempUser = {
    id: 1,
    name: 'Matt'
  }

export async function getUsers(req: RequestWithQueryValidation, res: Response, _: NextFunction) {
    const { skip, take, cursor, sort } = req.vQuery as ValidatedQueryParams;
    const sortingOptions: SortingOption<User>[] | undefined = sort ? getSortingOptions(req, tempUser) : undefined;
    // which fields to include in the return
  
      const users: User[] = await prisma.user.findMany<Prisma.UserFindManyArgs>({
        take,
        skip,
        cursor,
        orderBy: sortingOptions
      });
    
      res.json(users);
  }