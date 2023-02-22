import { type Request } from 'express';

export interface CursorPaginationOptions {
    take: number;
    skip: number;
    cursor?: {
        id: number;
    };
}

const maxLimitPerPage = 20;
const maxSkipLimit = 50;

const defaultLimitPerPage = 10;
const defaultSkip = 0;

export function getCursorPaginationOptions(req: Request): CursorPaginationOptions { 
    const cursor: { id: number } | undefined = typeof req.query.cursor === 'string' ? { id: parseInt(req.query.cursor as string) } : undefined;
    let take: number = typeof req.query.take === 'string' ? parseInt(req.query.take as string) : defaultLimitPerPage;
    let skip: number = typeof req.query.skip === 'string' ? parseInt(req.query.skip as string) : defaultSkip;

    if (Math.abs(take) > maxLimitPerPage) {
        if (take < 0) {
            take = 0 - maxLimitPerPage;
        } else {
            take = maxLimitPerPage;
        }
    }
    
    if (skip < 0) {
        skip = 0;
    } else if (skip > maxSkipLimit) {
        skip = maxSkipLimit;
    }

    return { take, skip, cursor };
}