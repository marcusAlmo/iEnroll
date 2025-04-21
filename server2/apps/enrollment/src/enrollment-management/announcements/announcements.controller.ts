import { Controller } from '@nestjs/common';
import { AnnouncementsService } from 'apps/api-gateway/src/enrollment/enrollment-management/announcements/announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementService: AnnouncementsService) {}

  
}
