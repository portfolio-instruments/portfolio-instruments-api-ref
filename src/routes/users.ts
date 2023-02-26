import express from "express";
import { getUsers } from "../controllers/users/getUsers";
import { asyncMiddleware } from "../middleware/async";
import { queryParamValidation } from "../middleware/queryParamValidation";

const router = express.Router();

router.get("/", queryParamValidation, asyncMiddleware(getUsers));

export default router;
