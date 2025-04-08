import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';

@Module({
  providers: [CreateAccountService],
  controllers: [CreateAccountController],
})
export class CreateAccountModule {}
