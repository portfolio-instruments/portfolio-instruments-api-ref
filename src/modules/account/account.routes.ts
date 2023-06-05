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
 *      summary: Create a new holding account
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
/**
 * @openapi
 * /accounts:
 *    get:
 *      summary: Retrieve a list of holding accounts
 *      tags:
 *        - Account
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/skipParam'
 *        - $ref: '#/components/parameters/takeParam'
 *        - $ref: '#/components/parameters/cursorParam'
 *        - $ref: '#/components/parameters/sortParam'
 *      responses:
 *          200:
 *              description: Successfully retrieved a list of holding accounts
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAccountsResponse'
 *          401:
 *              description: Unauthorized
 */
router.get('/', validateRequest(), requireUser, asyncWrapper(accountController.getAccountsHandler));
router.get('/:accountId', validateRequest(getAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.getAccountByIdHandler));

/** Update */
router.patch('/:accountId', validateRequest(patchAccountRequestSchema), requireUser, asyncWrapper(accountController.updateAccountByIdHandler));
router.put('/:accountId', validateRequest(putAccountRequestSchema), requireUser, asyncWrapper(accountController.updateAccountByIdHandler));

/** Delete */
router.delete('/:accountId', validateRequest(deleteAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.deleteAccountByIdHandler));

export default router;
