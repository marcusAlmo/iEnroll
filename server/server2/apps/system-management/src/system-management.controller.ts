import { Controller, Get } from '@nestjs/common';
import { SystemManagementService } from './system-management.service';

@Controller()
export class SystemManagementController {
  constructor(private readonly systemManagementService: SystemManagementService) {}

  @Get()
  getHello(): string {
    return this.systemManagementService.getHello();
  }
}
