import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'libs/prisma/src/prisma.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService],
})
export class AuthModule {}
