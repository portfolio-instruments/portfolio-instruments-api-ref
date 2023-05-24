import supertest from 'supertest';
import * as SessionMocks from './session.mocks';
import * as UserMocks from '../user/user.mocks';
import * as UserService from '../../modules/user/user.service';
import app from '../testApp';

/** POST /sessions */
describe('Session', () => {
  /** 201 */
  describe('Given the username and password are valid', () => {
    it('should succeed and return a valid access token', async () => {
      // Mock 'getUser' to return a valid user
      jest.spyOn(UserService, 'getUser').mockResolvedValueOnce(UserMocks.userPayloadBase);

      // Call with valid credentials
      const { statusCode, body } = await supertest(app).post('/v1/sessions').send(SessionMocks.createSessionRequest);
      expect(statusCode).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          expiresIn: expect.any(String),
        })
      );
    });
  });

  /** 401 */
  describe('Given the password is invalid', () => {
    it('should return a 401', async () => {
      // Mock 'getUser' to return a valid user
      jest.spyOn(UserService, 'getUser').mockResolvedValueOnce(UserMocks.userPayloadBase);

      // Call with invalid credentials
      const { statusCode } = await supertest(app)
        .post('/v1/sessions')
        .send({
          ...SessionMocks.createSessionRequest,
          password: 'invalid-password',
        });

      expect(statusCode).toBe(401);
    });
  });
});
