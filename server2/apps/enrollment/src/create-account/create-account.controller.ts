/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './create-account.dto';
import { CreateAccountService } from './create-account.service';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly usersService: CreateAccountService) {}
  @Get()
  getHello(): string {
    return 'Hello my Nigga';
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
