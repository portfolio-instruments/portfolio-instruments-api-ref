import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import sessionController from './session.controller';
import { sessionSchema } from './session.request.schema';

const router = express.Router();

/**
 * @openapi
 * /sessions:
 *    post:
 *      summary: Create a user login session
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
 *              description: Successfully created a user session
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateSessionResponse'
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 */
router.post('/', validateRequest(sessionSchema), asyncWrapper(sessionController.createUserSessionHandler));

export default router;
