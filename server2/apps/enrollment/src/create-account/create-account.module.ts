import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { AuthModule } from '@lib/auth/auth.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { AuthService } from '@lib/auth/auth.service';
import { AddressService } from '@lib/address';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CreateAccountService, PrismaService, AuthService, AddressService],
  controllers: [CreateAccountController],
})
export class CreateAccountModule {}
