import { type Request } from 'express';

export interface CursorPaginationOptions {
    take: number;
    skip: number;
    cursor?: number;
}

const maxLimitPerPage = 20;
const maxSkipLimit = 50;

const defaultLimitPerPage = 10;
const defaultSkip = 0;

export function getCursorPaginationOptions(req: Request): CursorPaginationOptions { 
    const cursor: number | undefined = req.query.cursor instanceof String ? parseInt(req.query.cursor as string) : undefined;
    let take: number = req.query.take instanceof String ? parseInt(req.query.take as string) : defaultLimitPerPage;
    let skip: number = req.query.skip instanceof String ? parseInt(req.query.skip as string) : defaultSkip;

    if (Math.abs(take) > maxLimitPerPage) {
        if (take < 0) {
            take = 0 - maxLimitPerPage;
        } else {
            take = maxLimitPerPage;
        }
    }
    
    if (skip > maxSkipLimit) {
        skip = maxSkipLimit;
    }

    return { take, skip, cursor };
}