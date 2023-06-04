import supertest from 'supertest';
import * as SessionService from '../../modules/session/session.service';
import app from '../testApp';
import * as UserMocks from '../user/user.mocks';
import * as SessionMocks from './session.mocks';

/** POST /sessions */
describe('Session', () => {
  /** 201 */
  describe('Given the username and password are valid', () => {
    it('should succeed and return a valid access token', async () => {
      const validateUserMock = jest.spyOn(SessionService, 'validateUser').mockResolvedValueOnce(SessionMocks.jwtUserPayload);

      // Call with valid credentials
      const { statusCode, body } = await supertest(app).post('/v1/sessions').send(SessionMocks.createSessionRequest);

      expect(statusCode).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          expiresIn: expect.any(String),
        })
      );
      expect(validateUserMock).toHaveBeenCalledWith(UserMocks.userPayloadBase.email, UserMocks.userPayloadBase.password);
    });
  });

  /** 401 */
  describe('Given the password is invalid', () => {
    it('should return a 401', async () => {
      jest.spyOn(SessionService, 'validateUser').mockResolvedValueOnce(null);

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
