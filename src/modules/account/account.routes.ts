import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import { createAccountRequestSchema } from './account.schema';
import accountController from './account.controller';

const router = express.Router();

router.get('/', validateRequest(), requireUser, asyncWrapper(accountController.getAllAccountsHandler));

router.post('/', validateRequest(createAccountRequestSchema), requireUser, asyncWrapper(accountController.createAccountHandler));

export default router;
