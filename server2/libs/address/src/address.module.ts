import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  providers: [AddressService, PrismaService],
  exports: [AddressService],
})
export class AddressModule {}
