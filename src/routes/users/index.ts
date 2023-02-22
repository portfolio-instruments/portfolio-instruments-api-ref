import { User, type Prisma } from "@prisma/client";
import express, { type Request, type Response } from "express";
import prisma from "../../config/prismaClient";
import { getCursorPaginationOptions, CursorPaginationOptions } from "../../utils/paginationUtils";
import { getSortingOptions, SortingOption } from "../../utils/sortingUtils";

const router = express.Router();

const tempUser = {
  id: 1,
  name: 'Matt'
}

router.get("/", async (req: Request, res: Response) => {
  const paginationOptions: CursorPaginationOptions = getCursorPaginationOptions(req);
  const sortingOptions: SortingOption<User>[] = getSortingOptions(req, tempUser);
  // which fields to include in the return
  // sort/order by - +name, -name

  const users: User[] = await prisma.user.findMany<Prisma.UserFindManyArgs>({
    take: paginationOptions.take,
    skip: paginationOptions.skip,
    cursor: paginationOptions.cursor,
    orderBy: sortingOptions
  });

  res.json(users);
});

export default router;
