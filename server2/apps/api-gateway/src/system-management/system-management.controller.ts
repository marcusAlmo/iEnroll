import { Controller, Get } from '@nestjs/common';
import { SystemManagementService } from './system-management.service';

// metrics.controller.ts
@Controller('system-management')
export class SystemManagementController {
  constructor(
    private readonly systemManagementService: SystemManagementService,
  ) {}

  @Get()
  getMetrics() {
    return this.systemManagementService.getSystemManagement();
  }
}
