import type { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

export type AsyncProcess = (req: Request, res: Response, next: NextFunction) => any;

export const asyncMiddleware = (asyncProcess: AsyncProcess) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncProcess(req, res, next);
    } catch (err: any) {
      if (err instanceof ApiError) {
        next(err);
      } else {
        next(ApiError.internal(err?.message));
      }
    }
  };
};