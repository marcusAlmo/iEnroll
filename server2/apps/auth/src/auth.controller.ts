import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@lib/dtos/src/auth/v1/login.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login_acc' })
  async login(@Payload() authDto: LoginDto) {
    console.log('authDto: ', authDto);

    const user = await this.authService.validateUser({
      username: authDto.username,
      password: authDto.password,
      email: authDto.email,
      emailEntered: authDto.emailEntered,
    });

    if (user === -1)
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_USER_NOT_FOUND',
      });
    else if (user === -2)
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_INVALID_PASSWORD',
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
