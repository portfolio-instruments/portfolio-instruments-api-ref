import { type Express } from "express";
import { queryParamValidation } from "../middleware/queryParamValidation";
import userRouter from './users';

export const apiVersion: string = "/v1";

export const combinedRouter = (app: Express): void => {
    app.get("/", queryParamValidation, async (_, res) => {
        res.send("Welcome...");
    });
    
    app.use(`${apiVersion}/users`, userRouter);
};
