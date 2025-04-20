import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { Announcements } from './interface/announcements.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async fetchAnnouncement(
    schoolId: number,
  ): Promise<Announcements['announcementFormat']> {
    const announcement = await this.retrieveAnnouncement(schoolId);

    if (!announcement)
      return {
        isActive: false,
        subject: '',
        contents: '',
      };

    return {
      isActive: announcement.is_active,
      subject: announcement.subject,
      contents: announcement.message,
    };
  }

  public async receiveAnnouncement(
    receiveInput: Announcements['announcementFormat'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const isExists = await this.retrieveAnnouncement(schoolId);

    if (!isExists) {
      if (!(await this.createAnnouncement(receiveInput, schoolId)))
        return this.microserviceUtilityService.internalServerErrorReturn(
          'Announcement creation has failed',
        );
    } else {
      if (!(await this.updateAnnouncement(receiveInput, schoolId)))
        return this.microserviceUtilityService.internalServerErrorReturn(
          'Announcement update has failed',
        );
    }

    return this.microserviceUtilityService.returnSuccess(
      isExists
        ? 'Announcement has been update successfully'
        : 'Announcement created successfuilly',
    );
  }

  // UTILITY FUNCTIONS

  private async retrieveAnnouncement(schoolId: number) {
    return await this.prisma.banner.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        is_active: true,
        subject: true,
        message: true,
      },
    });
  }

  private async createAnnouncement(
    receivedInput: Announcements['announcementFormat'],
    schoolId: number,
  ) {
    const result = await this.prisma.banner.create({
      data: {
        school_id: schoolId,
        subject: receivedInput.subject,
        message: receivedInput.contents,
        is_active: receivedInput.isActive,
      },
    });

    return result ? true : false;
  }

  private async updateAnnouncement(
    receivedInput: Announcements['announcementFormat'],
    schoolId: number,
  ) {
    const result = await this.prisma.banner.update({
      where: {
        school_id: schoolId,
      },
      data: {
        subject: receivedInput.subject,
        message: receivedInput.contents,
        is_active: receivedInput.isActive,
      },
    });

    return result ? true : false;
  }
}
