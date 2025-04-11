import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CreateAccountService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  create(payload: object) {
    return this.client.send(
      {
        cmd: 'create_account',
      },
      payload,
    );
  }

  getAllSchools() {
    return this.client.send(
      {
        cmd: 'get_all_schools',
      },
      {},
    );
  }
}
