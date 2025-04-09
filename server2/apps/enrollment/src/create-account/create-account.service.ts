import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-account.dto';

@Injectable()
export class CreateAccountService {
  create(createUserDto: CreateUserDto) {
    return 'Method not implemented.';
  }
}
