import { CreateSessionRequest } from '../../modules/session/session.schema';
import { userPayloadBase } from '../user/user.mocks';

export const createSessionRequest: CreateSessionRequest['body'] = {
  email: userPayloadBase.email,
  password: userPayloadBase.password,
};
