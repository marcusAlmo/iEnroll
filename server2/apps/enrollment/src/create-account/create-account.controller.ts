import { Controller, Get } from '@nestjs/common';

@Controller('create-account')
export class CreateAccountController {
  @Get()
  getHello(): string {
    return 'Hello my Nigga';
  }
}
