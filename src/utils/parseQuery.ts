import { Prisma } from '@prisma/client';
import type { Request } from 'express';

type SortingOption = Record<string, (typeof Prisma.SortOrder)[keyof typeof Prisma.SortOrder]>;

export interface ParsedQuery {
  /** https://stackoverflow.com/questions/40618327/how-to-design-generic-filtering-operators-in-the-query-string-of-an-api */
  // Filtering
  filter: {
    AND?: object[];
    startDate?: Date;
    endDate?: Date;
  };

  // Include
  select?: { [field: string]: boolean };
  expand?: boolean;

  // Pagination
  skip?: number;
  take?: number;
  cursor?: {
    id: number;
  };

  // Sorting
  sort?: SortingOption[];

  // Aggregate
}

export function parseQuery(req: Request, validKeys: string[]): ParsedQuery {
  // Filtering
  const AND = typeof req.query.filter === 'string' ? getCombinedFilters(req.query.filter) : undefined;
  const startDate = typeof req.query.startDate === 'string' ? new Date(req.query.startDate) : undefined;
  const endDate = typeof req.query.endDate === 'string' ? new Date(req.query.endDate) : undefined;
  const filter = { AND, startDate, endDate };

  // Include
  const select = typeof req.query.select === 'string' ? getSelectOptions(req.query.select) : undefined;
  const expand = req.query.expand?.toString()?.toLowerCase() === 'true' ? true : false;

  // Pagination
  const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip) : undefined;
  const take = typeof req.query.take === 'string' ? parseInt(req.query.take) : undefined;
  const cursor = typeof req.query.cursor === 'string' ? { id: parseInt(req.query.cursor) } : undefined;

  // Sorting
  const sort = typeof req.query.sort === 'string' ? getSortingOptions(req.query.sort, validKeys) : undefined;

  return { filter, select, expand, skip, take, cursor, sort };
}

function getCombinedFilters(filter: string): object[] {
  // Get the base string without any '[]' wrapper
  const filterString = filter[0] === '[' ? filter.slice(1, -1) : filter;
  const filterMap = filterString.split(';');

  const combinedFilters = [];
  for (const valuePair of filterMap) {
    const [key, value] = valuePair.split('=');
    let parsedValue: boolean | string | number | undefined;

    // Type coercion
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      parsedValue = Boolean(value);
    } else if (!isNaN(parseFloat(value))) {
      parsedValue = parseFloat(value);
    } else {
      parsedValue = value;
    }

    combinedFilters.push({ [key]: parsedValue });
  }

  return combinedFilters;
}

function getSelectOptions(select: string): Record<string, boolean> {
  const fields = select.trim().split(',');
  const selectOptions: Record<string, boolean> = {};

  fields.forEach((field) => {
    selectOptions[field] = true;
  });

  return selectOptions;
}

/** Sorting options passed in a form that Prisma likes */
export function getSortingOptions(sort: string, validKeys: string[]): SortingOption[] {
  const sortingOptions: SortingOption[] = [];
  const sortingFields: string[] = sort.split(',');

  for (const field of sortingFields) {
    const value: (typeof Prisma.SortOrder)[keyof typeof Prisma.SortOrder] = field[0] === '-' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;

    /**
     * If the first value is not a negative, that means the entire field is the key
     * This is because we omit '+' in the query string as it is a reserved character
     * Otherwise, truncate the first character and use the rest as the key
     */
    const key: string = value === Prisma.SortOrder.asc ? field : field.slice(1);

    if (validKeys.includes(key)) {
      sortingOptions.push({ [key]: value } as SortingOption);
    }
  }

  return sortingOptions;
}
