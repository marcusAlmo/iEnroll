import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getPartnerSchools() {
    return await this.prisma.school.findMany({
      select: {
        school_id: true,
        name: true,
        address: {
          select: {
            street: true,
            district: true,
            municipality: true,
          },
        },
        contact_number: true,
      },
      where: {
        is_active: true,
      },
    });
  }

  async getAnnouncements() {
    return await this.prisma.banner.findMany({
      select: {
        subject: true,
        message: true,
        update_datetime: true,
        creation_datetime: true,
      },
      where: {
        is_active: true,
      },
    });
  }
}
