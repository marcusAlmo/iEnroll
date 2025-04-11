import { Controller } from '@nestjs/common';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';
import { CreateAccountService } from './create-account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly usersService: CreateAccountService) {}

  @MessagePattern({ cmd: 'create_account' })
  async create(@Payload() createUserDto: CreateUserDto) {
    console.debug('Received payload:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'get_all_schools' })
  async getAllSchools() {
    return this.usersService.getAllSchools();
  }
}
