import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import {
  createAccountRequestSchema,
  deleteAccountByIdRequestSchema,
  patchAccountRequestSchema,
  getAccountByIdRequestSchema,
  putAccountRequestSchema,
} from './account.request.schema';
import accountController from './account.controller';

const router = express.Router();

/** Create */
/**
 * @openapi
 * /accounts:
 *    post:
 *      summary: Register a new holding account
 *      tags:
 *        - Account
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateAccountInput'
 *      responses:
 *          201:
 *              description: Successfully registered a new holding account
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateAccountResponse'
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 */
router.post('/', validateRequest(createAccountRequestSchema), requireUser, asyncWrapper(accountController.createAccountHandler));

/** Read */
router.get('/', validateRequest(), requireUser, asyncWrapper(accountController.getAccountsHandler));
router.get('/:accountId', validateRequest(getAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.getAccountByIdHandler));

/** Update */
router.patch('/:accountId', validateRequest(patchAccountRequestSchema), requireUser, asyncWrapper(accountController.updateAccountByIdHandler));
router.put('/:accountId', validateRequest(putAccountRequestSchema), requireUser, asyncWrapper(accountController.updateAccountByIdHandler));

/** Delete */
router.delete('/:accountId', validateRequest(deleteAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.deleteAccountByIdHandler));

export default router;
