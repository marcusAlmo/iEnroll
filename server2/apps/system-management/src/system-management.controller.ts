import { Controller, Get } from '@nestjs/common';

@Controller()
export class SystemManagementController {
  @Get()
  getHello(): string {
    return 'You are gay';
  }
}
