import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, validateSuccessType } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    let user: number | validateSuccessType = -1;

    if (authDto.username)
      user = await this.authService.validateUser({
        username: authDto.username,
        password: authDto.password,
      });
    else if (authDto.email)
      user = await this.authService.validateUser({
        email: authDto.email,
        password: authDto.password,
      });

    if (user === -1)
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'ERR_USER_NOT_FOUND',
        message: 'User does not exist',
      });
    else if (user === -2)
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'ERR_INVALID_PASSWORD',
        message: 'Invalid password',
      });
    else if (
      typeof user === 'object' &&
      user !== null &&
      'userId' in user &&
      'username' in user
    )
      return this.authService.login(user);
  }
}
