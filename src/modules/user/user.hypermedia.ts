import type { Settings, User } from '@prisma/client';
import { omit } from 'lodash';
import config from '../../config';
import { IHypermediaResponse, IResponseHyperlink } from '../IHypermediaResponse';
import { createSessionHypermediaComponent } from '../session/session.hypermedia';
import { createUserHypermediaSchema } from './user.schema';

/** User Hypermedia Components */
export const getUsersHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/users`,
  description: 'Retrieve users information',
  method: 'GET',
  type: [],
  access: 'Restricted',
  // query?
};

export const createUserHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/users`,
  description: 'Create a new user',
  method: 'POST',
  fields: createUserHypermediaSchema,
  type: ['application/json'],
};

export const createUserSettingsHypermediaComponent = (userId: number): IResponseHyperlink => {
  return {
    href: `${config.HOSTNAME}/v1/users/${userId}/settings`,
    description: 'Retrieve user settings',
    method: 'GET',
    type: [],
    access: 'Restricted',
    // query?
  };
};

/** User Hypermedia Responses */
export function getUsersHypermediaResponse(users: User[]): IHypermediaResponse<User> {
  return {
    data: users.map((user) => omit(user, ['password', 'role'])),
    _links: {
      self: { ...omit(getUsersHypermediaComponent, 'access') },
      // getUser
    },
  };
}

export function createUserHypermediaResponse(user: User, settings?: Settings): IHypermediaResponse<User & { settings?: Partial<Settings> }> {
  const data: Partial<User> & { settings?: Partial<Settings> } = {
    ...omit(user, ['password', 'role']),
    settings: settings ? omit(settings, ['userId']) : undefined,
  };

  return {
    data,
    _links: {
      self: { ...omit(createUserHypermediaComponent, 'fields'), status: 'Success' },
      getUsers: { ...getUsersHypermediaComponent },
      // delete?
      createSession: { ...createSessionHypermediaComponent },
    },
  };
}
