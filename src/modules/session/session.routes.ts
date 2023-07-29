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
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateSessionInput'
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
router.get('/', requireUser, asyncWrapper(sessionController.getUserSessionHandler));

export default router;
