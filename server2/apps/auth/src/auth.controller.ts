import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const user = await this.authService.validateUser(
      authDto.username,
      authDto.password,
    );
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
    else return this.authService.login(user);
  }
}
