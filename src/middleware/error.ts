import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

export async function errorMiddleware(err: Error, _: Request, res: Response, __: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "The server encountered an internal error and was unable to complete your request." });
}
