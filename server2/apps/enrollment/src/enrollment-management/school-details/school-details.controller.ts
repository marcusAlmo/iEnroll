import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SchoolDetailsService } from './school-details.service';
import { SchoolDetails } from './interface/school-details.interface';

@Controller('school-details')
export class SchoolDetailsController {
  constructor(private readonly schoolDetailsService: SchoolDetailsService) {}

  @MessagePattern({ cmd: 'retrieve-schoool-details' })
  async getSchoolDetails(payload: { schoolId: number }) {
    return this.schoolDetailsService.getSchoolDetails(payload.schoolId);
  }

  @MessagePattern({ cmd: 'save-school-details' })
  async saveSchoolDetails(payload: {
    schoolDetails: SchoolDetails['scholarDetails'];
    schoolId: number;
  }) {
    return this.schoolDetailsService.saveSchoolDetails(
      payload.schoolDetails,
      payload.schoolId,
    );
  }
}
