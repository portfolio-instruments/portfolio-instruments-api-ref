import { omit } from 'lodash';
import supertest from 'supertest';
import { createServer } from '../app';
import * as UserService from '../modules/user/user.service';
import Mocks from './user.mocks';

const app = createServer();

describe('user', () => {
  /** POST /users */
  describe('given the username/password is valid and the user is unique', () => {
    it('should return the user payload', async () => {
      const getUserServiceMock = jest.spyOn(UserService, 'getUser').mockResolvedValueOnce(null);
      const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockResolvedValueOnce(Mocks.createUserPayload);
      const { statusCode, body } = await supertest(app).post('/v1/users').send(Mocks.createUserRequest);

      expect(statusCode).toBe(201);
      expect(body).toEqual(Mocks.createUserPayload);

      const createUserRequest = omit(Mocks.createUserRequest, 'confirmPassword');
      expect(getUserServiceMock).toHaveBeenCalledWith(createUserRequest);
      expect(createUserServiceMock).toHaveBeenCalledWith(createUserRequest);
    });
  });

  /** GET /users */
  describe('get users route', () => {
    describe('given the user is logged in', () => {
      // Todo
    });

    describe('given the user is not logged in', () => {
      it('should return a 401', async () => {
        const { statusCode } = await supertest(app).get('/v1/users');
        expect(statusCode).toBe(401);
      });
    });
  });
});
