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

  private async getRemainingDays(
    schoolId: number,
  ): Promise<PlanCapacity['subDays']> {
    const durationDays = await this.prisma.school_subscription.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        start_datetime: true,
        end_datetime: true,
      },
      orderBy: { subscription_id: 'desc' },
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
    const count = await this.prisma.school_acad_year.findFirst({
      where: { school_id: schoolId },
      select: {
        consumption_data: {
          select: { download_count: true, upload_count: true },
          orderBy: { consumption_data_id: 'desc' },
          take: 1,
        },
      },
      take: 1,
      orderBy: { school_acad_year_id: 'desc' },
    });

    if (!count)
      return {
        downloadCount: { total: 0, max: 0 },
        uploadCount: { total: 0, max: 0 },
      };

    const downloadAndUploadTotal =
      await this.prisma.school_subscription.findFirst({
        where: { school_id: schoolId },
        select: {
          plan: {
            select: { max_download_count: true, max_image_upload_count: true },
          },
        },
        orderBy: { subscription_id: 'desc' },
        take: 1,
      });

    if (!downloadAndUploadTotal)
      return {
        downloadCount: { total: 0, max: 0 },
        uploadCount: { total: 0, max: 0 },
      };

    return {
      downloadCount: {
        total: count.consumption_data[0].download_count,
        max: Number(downloadAndUploadTotal.plan.max_download_count),
      },
      uploadCount: {
        total: count.consumption_data[0].upload_count,
        max: Number(downloadAndUploadTotal.plan.max_image_upload_count),
      },
    };
  }

  private async getAdminCount(
    schoolId: number,
  ): Promise<PlanCapacity['adminCount']> {
    const count = await this.prisma.user.count({
      where: {
        school_id: schoolId,
        user_role_user_role_assigned_byTouser: {
          some: {
            role_code: 'adm',
          },
        },
      },
    });

    const max = await this.prisma.school_subscription.findFirst({
      where: { school_id: schoolId },
      select: {
        plan: {
          select: { max_admin_count: true },
        },
      },
      orderBy: { subscription_id: 'desc' },
    });

    if (!max) return { total: 0, max: 0 };

    return {
      total: count,
      max: Number(max.plan.max_admin_count),
    };
  }

  

  private get24Hour(): number {
    return 1000 * 60 * 60 * 24;
  }
}
