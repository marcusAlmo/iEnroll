import { Controller, Get, Ip } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from '../logger/logger.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new LoggerService(UsersController.name);

  @SkipThrottle({ default: false })
  @Get('/all')
  async findAll(@Ip() ip: string) {
    this.logger.log(`Request for all Employees\t${ip}`);
    return this.usersService.findAll();
  }
}
