import { User } from '@lib/decorators/user.decorator';
import { Controller } from '@nestjs/common';
import { Post, Body, Get } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { ReceveInput } from './dto/announcements.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get('fetch')
  async fetchAnnouncements(@User('school_id') schoolId: number) {
    schoolId = 0;
    return await this.announcementsService.getAnnouncements({ schoolId });
  }

  @Post('receive')
  async receiveAnnouncement(
    @User('school_id') schoolId: number,
    @Body() receiveInput: ReceveInput,
  ) {
    schoolId = 0;
    return await this.announcementsService.receiveAnnouncements({
      receiveInput: receiveInput,
      schoolId,
    });
  }
}
