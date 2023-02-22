import { type Request } from "express";
import { SortDirection } from "../constants";

export type SortingOption<T extends Object> = {
    [Property in keyof T]: typeof SortDirection[keyof typeof SortDirection];
}

export function getSortingOptions<T extends Object>(req: Request, modelSelect: T): SortingOption<T>[] {
    const sortingOptions: SortingOption<T>[] = [];
    const sortingFields: string[] = typeof req.query.sort === 'string' ? req.query.sort.split(',') : [];
    
    for (const field of sortingFields) {
        const key: string = field.slice(1);
        const value: typeof SortDirection[keyof typeof SortDirection] = field[0] === '-' ? SortDirection.Desc : SortDirection.Asc;

        if (key in modelSelect) {
            sortingOptions.push(
                { [key]: value } as SortingOption<T>
            );
        }
    }
    
    return sortingOptions;
}
