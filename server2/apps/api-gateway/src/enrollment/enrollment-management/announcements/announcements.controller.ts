import { Controller } from '@nestjs/common';
<<<<<<< HEAD

@Controller('announcements')
export class AnnouncementsController {}
=======
import { Post, Body } from '@nestjs/common';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post('create')
  async createAnnouncement(
    @Body('property',
        pipes)() announcement: ReceiveInpu) {
    return this.announcementsService.createAnnouncement(announcement);
  }
}
>>>>>>> b8d262f438509b0d5617d2b04ef8c4e9f95f96e8
