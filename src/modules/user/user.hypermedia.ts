import type { User } from '@prisma/client';
import { omit } from 'lodash';
import config from '../../config';
import { IHypermediaResponse, IResponseHyperlink } from '../IHypermediaResponse';
import { createSessionHypermediaComponent } from '../session/session.hypermedia';
import { createUserHypermediaSchema } from './user.schema';

/** User Hypermedia Components */
export const createUserHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/users`,
  type: ['application/json'],
  description: 'Create a new user',
  method: 'POST',
  fields: createUserHypermediaSchema,
};

export const getUserHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/users`,
  type: [],
  description: 'Retrieve user information',
  method: 'GET',
  access: 'Restricted',
  // query?
};

/** User Hypermedia Responses */
export function createUserHypermediaResponse(user: User): IHypermediaResponse<User> {
  return {
    data: omit(user, ['password', 'role']),
    _links: {
      self: { ...createUserHypermediaComponent, status: 'Success' },
      session: { ...createSessionHypermediaComponent },
      get: { ...getUserHypermediaComponent },
      // delete?
    },
  };
}
