import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateReturn,
  GetAllAddressesReturn,
  GetAllSchoolsReturn,
} from './create-account.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreateAccountService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(payload: object) {
    const result: CreateReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'create_account',
        },
        payload,
      ),
    );
    return result;
  }

  async getAllSchools() {
    const result: GetAllSchoolsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_schools',
        },
        {},
      ),
    );
    return result;
  }

  async getAlAddresses() {
    const result: GetAllAddressesReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_addresses',
        },
        {},
      ),
    );
    return result;
  }
}
