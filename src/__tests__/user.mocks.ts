import { Settings, User } from '@prisma/client';
import { omit } from 'lodash';

/** Base */
const userSettingsPayloadBase: Settings = {
  id: 1,
  userId: 1,
  vpThreshold: 10,
  rebalanceThreshold: 10,
  createdAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
  updatedAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
};

const userPayloadBase: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  role: 'USER',
  createdAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
  updatedAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
};

/** Create user */
const createUserRequest = {
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  confirmPassword: 'abcd1234',
};

const createUserPayload: User & { settings: Omit<Settings, 'id' | 'userId'> } = {
  ...userPayloadBase,
  settings: { ...omit(userSettingsPayloadBase, ['id', 'userId']) },
};

/** Misc */
const jwtUserPayload: Omit<User, 'password'> = omit(userPayloadBase, 'password');
const getUsersPayload: Omit<User, 'password' | 'role'> = omit(userPayloadBase, ['password', 'role']);

export default { createUserRequest, createUserPayload, createSettingsPayload: userSettingsPayloadBase, jwtUserPayload, getUsersPayload };
