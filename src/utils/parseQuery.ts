import { Prisma } from '@prisma/client';
import { Request } from 'express';

type SortingOption = Record<string, typeof Prisma.SortOrder[keyof typeof Prisma.SortOrder]>;

export interface ParsedQuery {
  skip?: number;
  take?: number;
  cursor?: {
    id: number;
  };
  sort?: SortingOption[];
  expand?: string;
}

/** Only use after validating 'querySchema' via 'validateRequest' middleware */
export function parseQuery(req: Request, validKeys: string[]): ParsedQuery {
  const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
  const take = req.query.take ? parseInt(req.query.take as string) : undefined;
  const cursor = req.query.cursor ? { id: parseInt(req.query.cursor as string) } : undefined;
  const sort = req.query.sort ? getSortingOptions(req, validKeys) : undefined;
  return { skip, take, cursor, sort, expand: req.query.expand as string | undefined };
}

export function getSortingOptions(req: Request, validKeys: string[]): SortingOption[] {
  const sortingOptions: SortingOption[] = [];
  const sortingFields: string[] = (req.query.sort as string).split(',');

  for (const field of sortingFields) {
    const key: string = field.slice(1);
    const value: typeof Prisma.SortOrder[keyof typeof Prisma.SortOrder] = field[0] === '-' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;

    if (validKeys.includes(key)) {
      sortingOptions.push({ [key]: value } as SortingOption);
    }
  }

  return sortingOptions;
}
