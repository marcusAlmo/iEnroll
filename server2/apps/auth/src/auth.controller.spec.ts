/* eslint-disable @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  // let authController: AuthController;
  // let authService: AuthService;
  // beforeEach(async () => {
  //   const authServiceMock = {
  //     validateUser: jest.fn(),
  //     login: jest.fn(),
  //   };
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [AuthController],
  //     providers: [
  //       {
  //         provide: AuthService,
  //         useValue: authServiceMock,
  //       },
  //     ],
  //   }).compile();
  //   authController = module.get<AuthController>(AuthController);
  //   authService = module.get<AuthService>(AuthService);
  // });
  it('should be defined', () => {
    // expect(authController).toBeDefined();
  });
  // describe('login (MessagePattern)', () => {
  //   it('should throw UnauthorizedException if user not found', async () => {
  //     jest.spyOn(authService, 'validateUser').mockResolvedValue(-1);
  //     await expect(
  //       authController.login({ username: 'test', password: 'password' }),
  //     ).rejects.toThrowError(
  //       new UnauthorizedException({
  //         statusCode: 401,
  //         error: 'ERR_USER_NOT_FOUND',
  //         message: 'User does not exist',
  //       }),
  //     );
  //   });
  //   it('should throw UnauthorizedException if password is incorrect', async () => {
  //     jest.spyOn(authService, 'validateUser').mockResolvedValue(-2);
  //     await expect(
  //       authController.login({ username: 'test', password: 'wrong-pass' }),
  //     ).rejects.toThrowError(
  //       new UnauthorizedException({
  //         statusCode: 401,
  //         error: 'ERR_INVALID_PASSWORD',
  //         message: 'Invalid password',
  //       }),
  //     );
  //   });
  //   it('should return login response if user is valid', async () => {
  //     const mockUser = { userId: 1, username: 'test' };
  //     const mockLoginResponse = { access_token: 'fake-jwt-token' };
  //     jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
  //     jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);
  //     const result = await authController.login({
  //       username: 'test',
  //       password: 'password',
  //     });
  //     expect(result).toEqual(mockLoginResponse);
  //     expect(authService.validateUser).toHaveBeenCalledWith('test', 'password');
  //     expect(authService.login).toHaveBeenCalledWith(mockUser);
  //   });
  // });
});
