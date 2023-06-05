import type { Response } from 'express';
import { type CreateSessionContext, createSession } from './session.service';
import type { BaseRequest } from '../../IBaseRequest';
import type { CreateSessionRequest } from './session.request.schema';

/** Create */
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateSessionResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *        expiresIn:
 *          type: string
 */
type CreateUserSessionHandlerRequest = BaseRequest & CreateSessionRequest;

export async function createUserSessionHandler(req: CreateUserSessionHandlerRequest, res: Response): Promise<void> {
  const expiresIn = '2h' as const;
  const sessionContext: CreateSessionContext = { ...req.body, expiresIn };
  const jwtToken: string = await createSession(sessionContext);

  res.status(201).json({
    accessToken: jwtToken,
    expiresIn,
    // Todo: Refresh token
  });
}

export default { createUserSessionHandler };
