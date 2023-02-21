import { type Prisma } from "@prisma/client";
import express, { type Request, type Response } from "express";
import { number, object, string } from "superstruct";
import { prisma } from "../../config/prismaClient";
import { getCursorPaginationOptions, CursorPaginationOptions } from "../../utils/paginationUtils";
import { SortingOption, getSortingOptions } from "../../utils/sortingUtils";

const router = express.Router();

const userObject = object({
  id: number(),
  name: string()
});

router.get("/", (req: Request, res: Response) => {
  const paginationOptions: CursorPaginationOptions = getCursorPaginationOptions(req);
  const sortingOptions: SortingOption<typeof userObject> = getSortingOptions(req, userObject);
  // which fields to include in the return
  // sort/order by - +name, -name

  const users = prisma.user.findMany<Prisma.UserFindManyArgs>({
    take: paginationOptions.take,
    skip: paginationOptions.skip,
    cursor: {
      id: paginationOptions.cursor
    },
  });

  res.json(users);
});

export default router;
