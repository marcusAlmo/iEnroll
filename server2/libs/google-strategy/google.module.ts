// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthController } from './google.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy],
})
export class GoogleStrategyModule {}
