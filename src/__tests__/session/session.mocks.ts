import type { CreateSessionRequest } from '../../modules/session/session.request.schema';
import { userPayloadBase } from '../user/user.mocks';

export { jwtUserPayload } from '../user/user.mocks';

export const createSessionRequest: CreateSessionRequest['body'] = {
  email: userPayloadBase.email,
  password: userPayloadBase.password,
};
