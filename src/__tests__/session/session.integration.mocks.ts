import type { CreateSessionRequest } from '../../modules/session/session.request.schema';
import { userPayloadBase } from '../user/user.integration.mocks';

export { jwtUserPayload } from '../user/user.integration.mocks';

export const createSessionRequest: CreateSessionRequest['body'] = {
  email: userPayloadBase.email,
  password: userPayloadBase.password,
};
