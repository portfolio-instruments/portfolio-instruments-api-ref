import type { Request } from "express";

export type ValidatedQueryParams = {
    take?: number;
    skip?: number;
    cursor?: {
        id: number;
    }
    sort?: string;
}

export interface RequestWithQueryValidation extends Request {
    vQuery?: ValidatedQueryParams;
}