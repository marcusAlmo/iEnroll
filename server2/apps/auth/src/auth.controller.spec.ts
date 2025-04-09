import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock AuthService methods
    const authServiceMock = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return "Hello World!" from getHello()', () => {
    expect(authController.getHello()).toBe('Hello World!');
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      authService.validateUser = jest.fn().mockResolvedValue(-1);

      try {
        await authController.login({ username: 'test', password: 'password' });
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.response).toEqual({
          statusCode: 401,
          error: 'ERR_USER_NOT_FOUND',
          message: 'User does not exist',
        });
      }
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      authService.validateUser = jest.fn().mockResolvedValue(-2);

      try {
        await authController.login({
          username: 'test',
          password: 'wrong-password',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.response).toEqual({
          statusCode: 401,
          error: 'ERR_INVALID_PASSWORD',
          message: 'Invalid password',
        });
      }
    });

    it('should return login result if user is valid', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockLoginResponse = { access_token: 'fake-jwt-token' };

      authService.validateUser = jest.fn().mockResolvedValue(mockUser);
      authService.login = jest.fn().mockResolvedValue(mockLoginResponse);

      const result = await authController.login({
        username: 'test',
        password: 'password',
      });

      expect(result).toEqual(mockLoginResponse);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.validateUser).toHaveBeenCalledWith('test', 'password');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
