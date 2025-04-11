import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('enroll')
export class EnrollController {
  @MessagePattern({ cmd: 'get_hello' })
  getHello() {
    return 'Hello';
  }
}
