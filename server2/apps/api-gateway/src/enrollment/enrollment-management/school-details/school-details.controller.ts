import { Controller, Get, Post, Body } from '@nestjs/common';
import { SchoolDetailsService } from './school-details.service';
import { User } from '@lib/decorators/user.decorator';
import { SchoolDetails } from './dto/school-details.dto';

@Controller('school-details')
export class SchoolDetailsController {
  constructor(private readonly schoolDetailsService: SchoolDetailsService) {}

  @Get('retrieve')
  async getSchoolDetails(@User('school_id') schoolId: number) {
    return await this.schoolDetailsService.getSchoolDetails({ schoolId });
  }

  @Post('save')
  async saveSchoolDetails(
    @User('school_id') schoolId: number,
    @Body() schoolDetails: SchoolDetails,
  ) {
    schoolId = 0;
    return await this.schoolDetailsService.saveSchoolDetails({
      schoolDetails,
      schoolId,
    });
  }
}
