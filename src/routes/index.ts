import { type Express } from "express";
import { v1 } from "../constants";
import { queryParamValidation } from "../middleware/queryParamValidation";
import userRouter from './users';

export const combinedRouter = (app: Express): void => {
    app.get("/", queryParamValidation, async (_, res) => {
        res.send("Welcome...");
    });
    
    app.use(`${v1}/users`, userRouter);
};
