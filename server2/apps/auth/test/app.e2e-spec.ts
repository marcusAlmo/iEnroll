import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './../src/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/login (POST)', () => {
    it('should return access_token for valid user', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'john', password: 'changeme' }) // use actual valid creds
        .expect(201); // default success status for POST

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should return 400 if user does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'nonexistent', password: 'whatever' })
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        error: 'ERR_USER_NOT_FOUND',
        message: 'User does not exist',
      });
    });

    it('should return 400 if password is incorrect', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'john', password: 'wrongpassword' })
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        error: 'ERR_INVALID_PASSWORD',
        message: 'Invalid password',
      });
    });
  });
});
