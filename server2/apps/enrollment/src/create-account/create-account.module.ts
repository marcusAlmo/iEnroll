import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';
import { PrismaModule } from 'libs/prisma/src/prisma.module';
import { AuthModule } from 'libs/auth/auth.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { AuthService } from '@lib/auth/auth.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CreateAccountService, PrismaService, AuthService],
  controllers: [CreateAccountController],
})
export class CreateAccountModule {}
