import { User } from '@prisma/client';

const createUserRequest = {
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  confirmPassword: 'abcd1234',
};

export const createUserPayload: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  role: 'USER',
  createdAt: new Date('2021-09-30T13:31:07.674Z'),
  updatedAt: new Date('2021-09-30T13:31:07.674Z'),
};

export default { createUserRequest, createUserPayload };
