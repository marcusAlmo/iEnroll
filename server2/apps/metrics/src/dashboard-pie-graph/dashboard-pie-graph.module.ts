import { Module } from '@nestjs/common';
import { DashboardPieGraphService } from './dashboard-pie-graph.service';
import { DashboardPieGraphController } from './dashboard-pie-graph.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { CardsService } from '../cards/cards.service';
@Module({
  providers: [
    DashboardPieGraphService,
    PrismaService,
    MicroserviceUtilityService,
    CardsService,
  ],
  controllers: [DashboardPieGraphController],
})
export class DashboardPieGraphModule {}
