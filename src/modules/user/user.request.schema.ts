import type { TypeOf } from 'zod';
import { coerce } from 'zod';
import { object, string } from 'zod';

/** Query-able keys */
export const queryAbleUserKeys: string[] = ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'];

const paramsSchema = object({
  userId: coerce
    .number({ invalid_type_error: 'The userId must be a positive whole number' })
    .int('The userId must be a whole number')
    .positive('The userId must be a positive number'),
});

/** Create */
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - confirmPassword
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: password123
 *        confirmPassword:
 *          type: string
 *          default: password123
 */
export const createUserRequestSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email({ message: 'Not a valid email' }),
    name: string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(255, 'Name can be at most 255 characters long'),
    password: string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(255, 'Password can be at most 255 characters long'),
    confirmPassword: string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(255, 'Password can be at most 255 characters long'),
  }).strict(),
}).superRefine(({ body }, ctx) => {
  if (body.confirmPassword !== body.password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords did not match',
    });
  }
});

export type CreateUserRequest = TypeOf<typeof createUserRequestSchema>;

/** Read */
export const getUserByIdRequestSchema = object({
  params: paramsSchema.strict(),
});

export const getUserSettingsByIdRequestSchema = getUserByIdRequestSchema;

export type GetUserByIdRequest = { params: { userId: string } };
export type GetUserSettingsByIdRequest = GetUserByIdRequest;

/** Update */
/**
 * @openapi
 * components:
 *  schemas:
 *    PutUserSettingsInput:
 *      type: object
 *      required:
 *        - vpThreshold
 *        - rebalanceThreshold
 *      properties:
 *        vpThreshold:
 *          type: number
 *          default: 10
 *        rebalanceThreshold:
 *          type: number
 *          default: 10
 */
export const putUserSettingsByIdRequestSchema = object({
  body: object({
    vpThreshold: coerce
      .number({ invalid_type_error: 'The vpThreshold must be a positive whole number' })
      .int('The vpThreshold must be a whole number')
      .positive('The vpThreshold must be a positive number'),
    rebalanceThreshold: coerce
      .number({ invalid_type_error: 'The rebalanceThreshold must be a positive whole number' })
      .int('The rebalanceThreshold must be a whole number')
      .positive('The rebalanceThreshold must be a positive number'),
  }).strict(),
  params: paramsSchema.strict(),
});

export type PutUserSettingsByIdRequest = { body: TypeOf<typeof putUserSettingsByIdRequestSchema>['body'] } & { params: { userId: string } };
