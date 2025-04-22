import { Module } from '@nestjs/common';
import { SecureUtilityService } from './secure-utility.service';

@Module({
  providers: [SecureUtilityService],
  exports: [SecureUtilityService],
})
export class SecureUtilityModule {}
