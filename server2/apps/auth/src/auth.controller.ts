import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@lib/dtos/src/auth/v1/login.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login_acc' })
  async login(@Payload() authDto: LoginDto) {
    const user = await this.authService.validateUser(
      authDto.username,
      authDto.password,
    );

    if (user === -1)
      throw new RpcException({
        statusCode: 401,
        message: 'ERR_USER_NOT_FOUND',
      });
    else if (user === -2)
      throw new RpcException({
        statusCode: 401,
        message: 'ERR_INVALID_PASSWORD',
      });
    else return this.authService.login(user);
  }
}
