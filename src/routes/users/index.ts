import type { User, Prisma } from "@prisma/client";
import express, { NextFunction, type Response } from "express";
import prisma from "../../config/prismaClient";
import ApiError from "../../error/ApiError";
import { queryParamValidation } from "../../middleware/queryParamValidation";
import { RequestWithQueryValidation, ValidatedQueryParams } from "../../middleware/RequestWithQueryValidation";
import { getSortingOptions, SortingOption } from "../../utils/sortingUtils";

const router = express.Router();

const tempUser = {
  id: 1,
  name: 'Matt'
}

router.get("/", queryParamValidation, async (req: RequestWithQueryValidation, res: Response, next: NextFunction) => {
  const { skip, take, cursor, sort } = req.vQuery as ValidatedQueryParams;
  const sortingOptions: SortingOption<User>[] | undefined = sort ? getSortingOptions(req, tempUser) : undefined;
  // which fields to include in the return

  try {
    const users: User[] = await prisma.user.findMany<Prisma.UserFindManyArgs>({
      take,
      skip,
      cursor,
      orderBy: sortingOptions
    });
  
    res.json(users);
  } catch (err: any) {
    next(ApiError.internal(err.message));
  }
});

export default router;
