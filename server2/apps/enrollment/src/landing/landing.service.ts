import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LandingService {
  constructor(private readonly prisma: PrismaService) {}

  async getPartnerSchools() {
    return await this.prisma.school.findMany({
      select: {
        school_id: true,
        name: true,
        address: {
          select: {
            street: true,
            address_line_1: true,
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
    const result = await this.prisma.banner.findMany({
      select: {
        subject: true,
        message: true,
        update_datetime: true,
        creation_datetime: true,
        school: {
          select: {
            school_id: true,
            name: true,
          },
        },
      },
      where: {
        is_active: true,
      },
    });

    return result.map(
      ({
        subject,
        message,
        creation_datetime,
        update_datetime,
        school: { school_id, name },
      }) => ({
        subject,
        message,
        createdAt: creation_datetime,
        updatedAt: update_datetime,
        schoolId: school_id,
        schoolName: name,
      }),
    );
  }
}
