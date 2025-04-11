import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class SystemManagementController {
  @MessagePattern({ cmd: 'get_system_management' })
  getSystemManagement() {
    return { message: 'You are gay' };
  }
}
