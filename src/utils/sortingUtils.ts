import { Prisma } from '@prisma/client';
import { RequestWithQueryValidation, ValidatedQueryParams } from '../middleware/validateQuery';

export type SortingOption<T extends Object> = { [Property in keyof T]: typeof Prisma.SortOrder[keyof typeof Prisma.SortOrder] };

export function getSortingOptions<T extends Object>(req: RequestWithQueryValidation, modelSelect: T): SortingOption<T>[] {
  const sortingOptions: SortingOption<T>[] = [];
  const sortingFields: string[] = ((req.vQuery as ValidatedQueryParams).sort as string).split(',');

  for (const field of sortingFields) {
    const key: string = field.slice(1);
    const value: typeof Prisma.SortOrder[keyof typeof Prisma.SortOrder] = field[0] === '-' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;

    if (key in modelSelect) {
      sortingOptions.push({ [key]: value } as SortingOption<T>);
    }
  }

  return sortingOptions;
}
