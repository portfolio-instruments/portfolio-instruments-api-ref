import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import sessionController from './session.controller';
import { createSessionRequestSchema } from './session.request.schema';
import { requireUser } from '../../middleware/requireRole';

const router = express.Router();

/** Create */
/**
 * @openapi
 * /sessions:
 *    post:
 *      summary: Create a login session
 *      tags:
 *        - Session
 *      responses:
 *          201:
 *              description: Successfully created a login session
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateSessionResponse'
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
router.post('/', validateRequest(createSessionRequestSchema), asyncWrapper(sessionController.createUserSessionHandler));

/** Read */
/**
 * @openapi
 * /sessions:
 *    get:
 *      summary: Retrieve the current user's session
 *      tags:
 *        - Session
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully retrieved a list of holding accounts
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetSessionResponse'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          404:
 *              description: Session user not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.get('/', requireUser, asyncWrapper(sessionController.getUserSessionHandler));

export default router;
