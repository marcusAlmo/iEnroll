import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';
import { PrismaModule } from 'libs/prisma/src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CreateAccountService],
  controllers: [CreateAccountController],
})
export class CreateAccountModule {}
