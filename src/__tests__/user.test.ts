import supertest from 'supertest';
import { createServer } from '../app';

const app = createServer();

describe('user', () => {
  /** POST /users */
  describe('post users route', () => {
    // Todo
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
