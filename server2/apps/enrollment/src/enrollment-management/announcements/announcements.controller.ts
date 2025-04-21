import { Controller } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { MessagePattern } from '@nestjs/microservices';
import { Announcements } from './interface/announcements.interface';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @MessagePattern({ cmd: 'get_announcement' })
  async getAnnouncement(payload: { id: number }) {
    return await this.announcementsService.fetchAnnouncement(payload.id);
  }

  @MessagePattern({ cmd: 'receive_announcement' })
  async receiveAnnouncement(payload: {
    receiveInput: Announcements['announcementFormat'];
    schoolId: number;
  }) {
    return await this.announcementsService.receiveAnnouncement(
      payload.receiveInput,
      payload.schoolId,
    );
  }
}
