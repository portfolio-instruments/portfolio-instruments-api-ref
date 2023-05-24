import { Settings, User } from '@prisma/client';
import { omit } from 'lodash';

/** Base */
export const userSettingsPayloadBase: Settings = {
  id: 1,
  userId: 1,
  vpThreshold: 10,
  rebalanceThreshold: 10,
  createdAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
  updatedAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
};

export const userPayloadBase: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  role: 'USER',
  createdAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
  updatedAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
};

/** Create user */
export const createUserRequest = {
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  confirmPassword: 'abcd1234',
};

export const createUserPayload: User & { settings: Omit<Settings, 'id' | 'userId'> } = {
  ...userPayloadBase,
  settings: { ...omit(userSettingsPayloadBase, ['id', 'userId']) },
};

/** Misc */
export const jwtUserPayload: Omit<User, 'password'> = omit(userPayloadBase, 'password');
export const getUsersPayload: Omit<User, 'password' | 'role'> = omit(userPayloadBase, ['password', 'role']);
