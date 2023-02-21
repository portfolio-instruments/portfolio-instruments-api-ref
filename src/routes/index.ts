import { type Express } from "express";
import { v1 } from "../constants";
import userRouter from './users';

export const combinedRouter = (app: Express): void => {
    app.use(`${v1}/users`, userRouter);
};
