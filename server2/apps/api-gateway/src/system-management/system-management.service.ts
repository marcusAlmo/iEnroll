import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// metrics.service.ts
@Injectable()
export class SystemManagementService {
  // eslint-disable-next-line
  constructor(@Inject('SYSTEM_MANAGEMENT_SERVICE') private readonly client: ClientProxy) {}

  getSystemManagement() {
    return this.client.send({ cmd: 'get_system_management' }, {});
  }
}
