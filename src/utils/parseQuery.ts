import { Prisma } from '@prisma/client';
import { Request } from 'express';

type SortingOption = Record<string, (typeof Prisma.SortOrder)[keyof typeof Prisma.SortOrder]>;

export interface ParsedQuery {
  pageNumber: number;
  pageSize: number;
  sort?: SortingOption[];
  expand?: string;
}

/** Only use after validating 'querySchema' via 'validateRequest' middleware */
export function parseQuery(req: Request, validKeys: string[]): ParsedQuery {
  const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber as string) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 50;
  const sort = req.query.sort ? getSortingOptions(req, validKeys) : undefined;
  return { pageNumber, pageSize, sort, expand: req.query.expand as string | undefined };
}

export function getSortingOptions(req: Request, validKeys: string[]): SortingOption[] {
  const sortingOptions: SortingOption[] = [];
  const sortingFields: string[] = (req.query.sort as string).split(',');

  for (const field of sortingFields) {
    const key: string = field.slice(1);
    const value: (typeof Prisma.SortOrder)[keyof typeof Prisma.SortOrder] = field[0] === '-' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;

    if (validKeys.includes(key)) {
      sortingOptions.push({ [key]: value } as SortingOption);
    }
  }

  return sortingOptions;
}
