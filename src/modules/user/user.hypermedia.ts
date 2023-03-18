import type { User } from '@prisma/client';
import { omit } from 'lodash';
import config from '../../config';
import { IHypermediaResponse, IResponseHyperlink } from '../IHypermediaResponse';
import { createSessionHypermediaComponent } from '../session/session.hypermedia';
import { createUserHypermediaSchema } from './user.schema';

/** User Hypermedia Components */
export const getUsersHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/users`,
  type: [],
  description: 'Retrieve user information',
  method: 'GET',
  access: 'Restricted',
  // query?
};

export const createUserHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/users`,
  type: ['application/json'],
  description: 'Create a new user',
  method: 'POST',
  fields: createUserHypermediaSchema,
};

/** User Hypermedia Responses */
export function getUsersHypermediaResponse(users: User[]): IHypermediaResponse<User> {
  return {
    data: users.map((user) => omit(user, ['password', 'role'])),
    _links: {
      self: { ...omit(getUsersHypermediaComponent, 'access') },
    },
    // query?
  };
}

export function createUserHypermediaResponse(user: User): IHypermediaResponse<User> {
  return {
    data: omit(user, ['password', 'role']),
    _links: {
      self: { ...omit(createUserHypermediaComponent, 'fields'), status: 'Success' },
      session: { ...createSessionHypermediaComponent },
      get: { ...getUsersHypermediaComponent },
      // delete?
    },
  };
}
