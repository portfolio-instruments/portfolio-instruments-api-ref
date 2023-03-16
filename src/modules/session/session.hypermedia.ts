import config from '../../config';
import { IHypermediaResponse, IResponseHyperlink } from '../IHypermediaResponse';
import { getUserHypermediaComponent } from '../user/user.hypermedia';
import { createSessionHypermediaSchema } from './session.schema';

/** Session Hypermedia Components */
export const createSessionHypermediaComponent: IResponseHyperlink = {
  href: `${config.HOSTNAME}/v1/sessions`,
  type: ['application/json'],
  description: 'Create a new session for the user',
  method: 'POST',
  fields: createSessionHypermediaSchema,
};

/** Session Hypermedia Responses */
export function createSessionHypermediaResponse(authToken: string): IHypermediaResponse<null> {
  return {
    message: 'User session created successfully',
    _links: {
      self: { ...createSessionHypermediaComponent, status: 'Success' },
      user: { ...getUserHypermediaComponent, authToken },
    },
  };
}
