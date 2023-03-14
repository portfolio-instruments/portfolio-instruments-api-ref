import { IHypermediaResponse } from '../IHypermediaResponse';
import config from '../../config';
import { getUserDescription } from '../user/user.hypermedia';

export const createSessionDescription: string = 'Create a new session for the user';

export function createSessionHypermediaResponse(authToken: string): IHypermediaResponse<null> {
  return {
    message: 'User session created successfully',
    _links: {
      self: {
        href: `${config.HOSTNAME}/v1/sessions`,
        type: ['application/json'],
        description: createSessionDescription,
        method: 'POST',
        status: 'Success',
      },
      next: {
        href: `${config.HOSTNAME}/v1/users`,
        type: [],
        description: getUserDescription,
        method: 'GET',
        authToken,
      },
    },
  };
}
