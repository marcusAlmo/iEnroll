// libs/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, AuthService, PrismaService],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
