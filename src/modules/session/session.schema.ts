import { object, string, TypeOf } from 'zod';

export const sessionSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }),
    password: string({ required_error: 'Password is required' })
  }),
});

export type CreateSessionRequest = TypeOf<typeof sessionSchema>;
export type CreateSessionContext = CreateSessionRequest['body'];
