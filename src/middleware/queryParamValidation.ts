import type { NextFunction, Response } from 'express';
import { z } from 'zod';
import ApiError from '../errors/ApiError';
import { RequestWithQueryValidation } from './RequestWithQueryValidation';

interface QueryParams {
    take?: string;
    skip?: string;
    cursor?: string;
    sort?: string;
}

const queryParamSchema = z.object({
    sort: z.string().optional(),
    take: z.coerce.number().min(-20).max(20).optional(),
    skip: z.coerce.number().min(0).max(50).optional(),
    cursor: z.coerce.number().int().optional()
});

export function queryParamValidation(req: RequestWithQueryValidation, _: Response, next: NextFunction) {
    const queryParams = req.query as QueryParams;
    try {
        queryParamSchema.parse(queryParams);
    } catch (err: any) {
        next(ApiError.badRequest(err.message));
    }

    req.vQuery = {
        take: (queryParams.take) ? parseInt(queryParams.take) : undefined,
        skip: (queryParams.skip) ? parseInt(queryParams.skip) : undefined,
        cursor: (queryParams.cursor) ? { id: parseInt(queryParams.cursor) } : undefined,
        sort: queryParams.sort
    };
    next();
}

