import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PlanCapacity } from './interface/plan-capacity.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class PlanCapacityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async getPlanCapacity(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const downloadUploadCapacity =
      await this.getDownloadAndUploadCount(schoolId);
    const adminCount = await this.getAdminCount(schoolId);
    const studentEnrollmentCapacity =
      await this.getStudentEnrollmentCapacity(schoolId);
    const remainingDays = await this.getRemainingDays(schoolId);

    const finalData = {
      downloadUploadCapacity: downloadUploadCapacity,
      adminCount: adminCount,
      studentEnrollmentCapacity: studentEnrollmentCapacity,
      remainingDays: remainingDays,
    };

    return this.microserviceUtilityService.returnSuccess(finalData);
  }

  private async getRemainingDays(
    schoolId: number,
  ): Promise<PlanCapacity['univCounting']> {
    const durationDays = await this.prisma.school_subscription.findFirst({
      where: { school_id: schoolId, plan: { is_active: true } },
      select: { start_datetime: true, end_datetime: true },
      orderBy: { subscription_id: 'desc' },
    });

    if (!durationDays) return { total: 0, max: 0 };

    // eslint-disable-next-line
    const endDate = new Date(durationDays.end_datetime);
    // eslint-disable-next-line
    const startDate = new Date(durationDays.start_datetime);

    const remainingDays = Math.ceil(
      (endDate.getTime() - new Date().getTime()) / this.get24Hour(),
    );

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / this.get24Hour(),
    );

    return {
      total: remainingDays > 0 ? remainingDays : 0,
      max: totalDays,
    };
  }

  private async getDownloadAndUploadCount(
    schoolId: number,
  ): Promise<PlanCapacity['downloadAndUploadCount']> {
    const count = await this.prisma.school_acad_year.findFirst({
      where: { school_id: schoolId },
      select: {
        consumption_data: {
          select: { file_download_count: true, file_upload_count: true },
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
        where: { school_id: schoolId, plan: { is_active: true } },
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
        total: count.consumption_data[0].file_download_count,
        max: Number(downloadAndUploadTotal.plan.max_download_count),
      },
      uploadCount: {
        total: count.consumption_data[0].file_upload_count,
        max: Number(downloadAndUploadTotal.plan.max_image_upload_count),
      },
    };
  }

  private async getAdminCount(
    schoolId: number,
  ): Promise<PlanCapacity['univCounting']> {
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
      where: { school_id: schoolId, plan: { is_active: true } },
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

  private async getStudentEnrollmentCapacity(
    schoolId: number,
  ): Promise<PlanCapacity['univCounting']> {
    const count = await this.prisma.enrollment_data.findFirst({
      where: { school_acad_year: { school_id: schoolId } },
      select: {
        approved_application_count: true,
      },
      orderBy: { enrollment_data_id: 'desc' },
    });

    if (!count) return { total: 0, max: 0 };

    const enrollmentMax = await this.prisma.school_subscription.findFirst({
      where: { school_id: schoolId, plan: { is_active: true } },
      select: {
        plan: {
          select: { max_student_count: true },
        },
      },
      orderBy: { subscription_id: 'desc' },
    });

    if (!enrollmentMax) return { total: 0, max: 0 };

    return {
      total: count.approved_application_count,
      max: enrollmentMax.plan.max_student_count,
    };
  }

  private get24Hour(): number {
    return 1000 * 60 * 60 * 24;
  }
}
