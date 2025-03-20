import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { user } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<Pick<user, 'username' | 'user_id'>[]> {
    return this.appService.getHello();
  }
}
