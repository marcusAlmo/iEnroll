// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthController } from './google.controller';
import { GoogleStrategy } from './google.strategy';
import { SecureUtilityModule } from '../secure-utility/secure-utility.module';

@Module({
  imports: [PassportModule, SecureUtilityModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy],
})
export class GoogleStrategyModule {}
