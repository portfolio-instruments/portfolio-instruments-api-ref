import { Prisma, User } from '@prisma/client';
import { ParsedQuery } from '../../utils/parseQuery';
import prisma from '../../utils/prisma';

export function getAllUsers(options: ParsedQuery): Promise<User[]> {
  return prisma.user.findMany<Prisma.UserFindManyArgs>({
    take: options.take,
    skip: options.skip,
    cursor: options.cursor,
    orderBy: options.sort,
  });
}
