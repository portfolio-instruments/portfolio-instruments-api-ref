import type { TypeOf } from 'zod';
import { object, string } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateSessionInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: password123
 */
export const createSessionRequestSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }),
    password: string({ required_error: 'Password is required' }),
  }).strict(),
});

export type CreateSessionRequest = TypeOf<typeof createSessionRequestSchema>;
export type CreateSessionContext = CreateSessionRequest['body'];
