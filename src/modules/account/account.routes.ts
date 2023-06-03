import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import {
  createAccountRequestSchema,
  deleteAccountByIdRequestSchema,
  editAccountRequestSchema,
  getAccountByIdRequestSchema,
} from './account.request.schema';
import accountController from './account.controller';

const router = express.Router();

router.get('/', validateRequest(), requireUser, asyncWrapper(accountController.getAccountsHandler));
router.get('/:accountId', validateRequest(getAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.getAccountByIdHandler));

router.patch('/:accountId', validateRequest(editAccountRequestSchema), requireUser, asyncWrapper(accountController.editAccountByIdHandler));

router.post('/', validateRequest(createAccountRequestSchema), requireUser, asyncWrapper(accountController.createAccountHandler));

router.delete('/:accountId', validateRequest(deleteAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.deleteAccountByIdHandler));

export default router;
