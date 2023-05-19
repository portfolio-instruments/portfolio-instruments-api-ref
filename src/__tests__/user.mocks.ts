import { Settings, User } from '@prisma/client';
import { omit } from 'lodash';

const createUserRequest = {
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  confirmPassword: 'abcd1234',
};

const createSettingsPayload: Settings = {
  id: 1,
  userId: 1,
  vpThreshold: 10,
  rebalanceThreshold: 10,
  createdAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
  updatedAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
};

const createUserPayload: User & { settings: Omit<Settings, 'id' | 'userId'> } = {
  id: 1,
  email: 'test@example.com',
  name: 'Bobby Newport',
  password: 'abcd1234',
  role: 'USER',
  settings: { ...omit(createSettingsPayload, ['id', 'userId']) },
  createdAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
  updatedAt: '2021-09-30T13:31:07.674Z' as unknown as Date,
};

const jwtUserPayload: Omit<User, 'password'> = omit(createUserPayload, ['password', 'settings']);
const getUsersPayload: Omit<User, 'password' | 'role'> = omit(createUserPayload, 'password', 'role', 'settings');

export default { createUserRequest, createUserPayload, createSettingsPayload, jwtUserPayload, getUsersPayload };
