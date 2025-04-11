import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  createAccount(@Body() createAccountDto: CreateUserDto) {
    return this.createAccountService.create(createAccountDto);
  }

  @Get('schools')
  getAllAvailableSchools() {
    return this.createAccountService.getAllSchools();
  }
}
