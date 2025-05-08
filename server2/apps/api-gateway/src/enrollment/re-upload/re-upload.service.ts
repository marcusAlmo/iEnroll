import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReUploadService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}
}
