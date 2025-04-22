import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateUserDto) {
    return await this.createAccountService.create(createAccountDto);
  }

  @Get('school')
  async getAllAvailableSchools() {
    return await this.createAccountService.getAllSchools();
  }

  @Get('address')
  async getAllAddresses() {
    return await this.createAccountService.getAlAddresses();
  }
}
