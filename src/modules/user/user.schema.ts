import { object, string, TypeOf } from 'zod';
import { IResponseHyperlinkField } from '../IHypermediaResponse';

export const userKeys: string[] = ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'];

export const createUserHypermediaSchema: IResponseHyperlinkField[] = [
  { field: 'email', type: 'string', required: true },
  { field: 'password', type: 'string', required: true },
  { field: 'name', type: 'string', required: true },
];

export const createUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email({ message: 'Not a valid email' }),
    name: string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(255, 'Name can be at most 255 characters long'),
    password: string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(255, 'Password can be at most 255 characters long'),
  }),
});

export type CreateUserRequest = TypeOf<typeof createUserSchema>;
export type CreateUserContext = CreateUserRequest['body'];
