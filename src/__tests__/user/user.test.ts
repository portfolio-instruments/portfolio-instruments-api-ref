import { createServer } from 'http';
import { omit } from 'lodash';
import supertest from 'supertest';
import config from '../../config';
import { signJwt } from '../../modules/session/session.utils';
import * as UserService from '../../modules/user/user.service';
import * as Mocks from './user.mocks';

const app = createServer();

describe('User', () => {
  /** POST /users */
  describe('Register user', () => {
    /** 201 */
    describe('Given the user is unique, and the username/password are valid', () => {
      it('should succeed and return the user payload', async () => {
        const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockResolvedValueOnce(omit(Mocks.createUserPayload, 'settings'));
        const createSettingsServiceMock = jest.spyOn(UserService, 'createUserSettings').mockResolvedValueOnce(Mocks.userSettingsPayloadBase);

        const { statusCode, body } = await supertest(app).post('/v1/users').send(Mocks.createUserRequest);
        expect(statusCode).toBe(201);
        expect(body).toEqual(omit(Mocks.createUserPayload, 'password'));

        expect(createSettingsServiceMock).toHaveBeenCalledWith(Mocks.createUserPayload.id);

        // Password will look different since we hash it before creating
        expect(createUserServiceMock).toHaveBeenCalledWith(
          expect.objectContaining({
            ...omit(Mocks.createUserRequest, 'confirmPassword'),
            password: expect.not.stringMatching(Mocks.createUserRequest.password),
          })
        );
      });
    });

    /** 400 */
    describe('Given the request body contains an incorrect payload', () => {
      it('should return a 400', async () => {
        const { statusCode } = await supertest(app).post('/v1/users').send({});
        expect(statusCode).toBe(400);
      });
    });

    /** 409 */
    describe('Given the user is not unique', () => {
      it('should return a 409', async () => {
        await supertest(app).post('/v1/users').send(Mocks.createUserRequest);
        const { statusCode } = await supertest(app).post('/v1/users').send(Mocks.createUserRequest);

        expect(statusCode).toBe(409);
      });
    });
  });

  /** GET /users */
  describe('Find users', () => {
    /** 200 */
    describe('Given a user with default user role is logged in', () => {
      it('should return a valid user', async () => {
        const jwt = signJwt(Mocks.jwtUserPayload, config.JWT_ACCESS_TOKEN_SECRET, '2h');
        jest.spyOn(UserService, 'getAllUsers').mockResolvedValueOnce([omit(Mocks.createUserPayload, 'settings')]);

        const { statusCode, body } = await supertest(app).get('/v1/users').set('Authorization', `Bearer ${jwt}`);
        expect(statusCode).toBe(200);
        expect(body).toEqual([Mocks.getUsersPayload]);
      });
    });

    /** 401 */
    describe('Given the user is not logged in', () => {
      it('should return a 401', async () => {
        const { statusCode } = await supertest(app).get('/v1/users');
        expect(statusCode).toBe(401);
      });
    });
  });
});
