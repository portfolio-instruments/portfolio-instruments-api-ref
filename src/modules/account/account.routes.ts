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
 *      summary: Create a holding account
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.get('/', validateRequest(), requireUser, asyncWrapper(accountController.getAccountsHandler));

/**
 * @openapi
 * '/accounts/{accountId}':
 *   get:
 *     tags:
 *       - Account
 *     summary: Retrieve a holding account
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/accountId'
 *     responses:
 *       '200':
 *         description: Successfully retrieved a holding account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       '400':
 *         description: Bad Request
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Account not found
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *
 * components:
 *   parameters:
 *     accountId:
 *         name: accountId
 *         in: path
 *         description: The id of the holding account
 *         required: true
 */
router.get('/:accountId', validateRequest(getAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.getAccountByIdHandler));

/** Update */
/**
 * @openapi
 * '/accounts/{accountId}':
 *   patch:
 *     tags:
 *       - Account
 *     summary: Partially update a holding account
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PatchAccountInput'
 *     parameters:
 *       - $ref: '#/components/parameters/accountId'
 *     responses:
 *       '200':
 *         description: Successfully updated a holding account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       '400':
 *         description: Bad Request
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Account not found
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 */
router.patch('/:accountId', validateRequest(patchAccountRequestSchema), requireUser, asyncWrapper(accountController.updateAccountByIdHandler));

/**
 * @openapi
 * '/accounts/{accountId}':
 *   put:
 *     tags:
 *       - Account
 *     summary: Completely update a holding account
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PutAccountInput'
 *     parameters:
 *       - $ref: '#/components/parameters/accountId'
 *     responses:
 *       '200':
 *         description: Successfully updated a holding account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:accountId', validateRequest(putAccountRequestSchema), requireUser, asyncWrapper(accountController.updateAccountByIdHandler));

/** Delete */
/**
 * @openapi
 * '/accounts/{accountId}':
 *   delete:
 *     tags:
 *       - Account
 *     summary: Delete a holding account
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/accountId'
 *     responses:
 *       '204':
 *         description: Successfully deleted a holding account
 *       '400':
 *         description: Bad Request
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Account not found
 *         content:
 *             application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/Error'
 */
router.delete('/:accountId', validateRequest(deleteAccountByIdRequestSchema), requireUser, asyncWrapper(accountController.deleteAccountByIdHandler));

export default router;
