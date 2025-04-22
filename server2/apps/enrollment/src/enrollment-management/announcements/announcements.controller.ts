import { Controller } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { MessagePattern } from '@nestjs/microservices';
import { Announcements } from './interface/announcements.interface';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @MessagePattern({ cmd: 'get-announcement' })
  async getAnnouncement(payload: { schoolId: number }) {
    return await this.announcementsService.fetchAnnouncement(payload.schoolId);
  }

  @MessagePattern({ cmd: 'receive-announcement' })
  async receiveAnnouncement(payload: {
    receiveInput: Announcements['receiveInput'];
    schoolId: number;
  }) {
    return await this.announcementsService.receiveAnnouncement(
      payload.receiveInput,
      payload.schoolId,
    );
  }
}
