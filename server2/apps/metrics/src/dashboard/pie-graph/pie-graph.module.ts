import { Module } from '@nestjs/common';
import { PieGraphService } from './pie-graph.service';
import { PieGraphController } from './pie-graph.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { CardsService } from '../cards/cards.service';
@Module({
  providers: [
    PieGraphService,
    PrismaService,
    MicroserviceUtilityService,
    CardsService,
  ],
  controllers: [PieGraphController],
})
export class PieGraphModule {}
