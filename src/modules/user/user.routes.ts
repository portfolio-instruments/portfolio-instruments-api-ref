import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import userController from './user.controller';
import { createUserRequestSchema } from './user.request.schema';

const router = express.Router();

/** Create */
/**
 * @openapi
 * /users:
 *    post:
 *      summary: Create a new user
 *      tags:
 *        - User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          201:
 *              description: Successfully created a new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateUserResponse'
 *          400:
 *              description: Bad request
 *          409:
 *              description: Conflict
 */
router.post('/', validateRequest(createUserRequestSchema), asyncWrapper(userController.createUserHandler));

/** Read */
router.get('/', validateRequest(), requireUser, asyncWrapper(userController.getUsersHandler));

export default router;
