import { object, string, TypeOf } from 'zod';
import { IResponseHyperlinkField } from '../IHypermediaResponse';

export const createSessionHypermediaSchema: IResponseHyperlinkField[] = [
  { field: 'email', type: 'string', required: true },
  { field: 'password', type: 'string', required: true },
];

export const sessionSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }),
    password: string({ required_error: 'Password is required' }),
  }),
});

export type CreateSessionRequest = TypeOf<typeof sessionSchema>;
export type CreateSessionContext = CreateSessionRequest['body'];
