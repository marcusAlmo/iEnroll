import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post('create')
  async createAnnouncement(
    @Body('property',
        pipes)() announcement: ReceveInput) {
    return this.announcementsService.createAnnouncement(announcement);
  }
}
