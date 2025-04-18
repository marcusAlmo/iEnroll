import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PlanCapacity } from './interface/plan-capacity.interface';

@Injectable()
export class PlanCapacityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async getPlanCapacity(schoolId: number) {
    
  }

  private async getRemainingDays(schoolId: number): Promise<PlanCapacity['subDays']> {
    const durationDays = await this.prisma.school_subscription.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        start_datetime: true,
        end_datetime: true,
      },
    });

    if (!durationDays) return { remainingDays: 0, totalDays: 0 };

    const endDate = new Date(durationDays.end_datetime);
    const startDate = new Date(durationDays.start_datetime);

    const remainingDays = Math.ceil(
      (endDate.getTime() - new Date().getTime()) / this.get24Hour(),
    );

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / this.get24Hour(),
    );

    return {
      remainingDays: remainingDays > 0 ? remainingDays : 0,
      totalDays,
    };
  }

  private async getDownloadAndUploadCount(
    schoolId: number,
  ): Promise<PlanCapacity['downloadAndUploadCount']> {
    // eslint-disable-next-line
    const downloadAndUploadCount = await this.prisma.school_acad_year.findFirst({
        where: { school_id: schoolId },
        select: {
          consumption_data: {
            select: {
              download_count: true,
              upload_count: true,
            },
          },
        },
        take: 1,
    });

    if (!downloadAndUploadCount)
      return {
        downloadCount: {
          remaining: 0,
          total: 0,
        },
        uploadCount: {
          remaining: 0,
          total: 0,
        },
      };

    const downloadAndUploadTotal = this.prisma.school_subscription.findFirst({
        where: { school_id: schoolId },
        select: {
          
        }
    })

    return {
      downloadCount: {
        remaining: 0,
        total: 0,
      },
      uploadCount: {
        remaining: 0,
        total: 0,
      },
    };
  }

  private get24Hour(): number {
    return (1000 * 60 * 60 * 24);
  }
}
