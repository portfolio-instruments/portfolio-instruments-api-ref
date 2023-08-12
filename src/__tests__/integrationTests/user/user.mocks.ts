import type { Settings, User } from '@prisma/client';
import { omit } from 'lodash';

/** Base */
export const userSettingsPayloadBase: Settings = {
  id: 1,
  userId: 1,
  vpThresholdPercent: 10,
  rebalanceThresholdPercent: 10,
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

type createUserSettingsPayload = Omit<Settings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export const createUserPayload: User & { settings: createUserSettingsPayload } = {
  ...userPayloadBase,
  settings: {
    vpThresholdPercent: userSettingsPayloadBase.vpThresholdPercent,
    rebalanceThresholdPercent: userSettingsPayloadBase.rebalanceThresholdPercent,
  },
};

/** Misc */
export const jwtUserPayload: Omit<User, 'password'> = omit(userPayloadBase, 'password');
export const getUsersPayload: Omit<User, 'password'> = jwtUserPayload;
