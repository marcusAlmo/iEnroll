import { Controller, Get, Post, Body } from '@nestjs/common';
import { SchoolClassificationService } from './school-classification.service';
import { User } from '@lib/decorators/user.decorator';
import { SchoolClassification } from './dto/school-classification.dto';

@Controller('school-classification')
export class SchoolClassificationController {
  constructor(
    private readonly schoolClassification: SchoolClassificationService,
  ) {}

  @Get('retrieve')
  async getSchoolClassification(@User('school_id') schoolId: number) {
    schoolId = 0;
    return await this.schoolClassification.getSchoolClassification({
      schoolId,
    });
  }

  @Post('save')
  async saveSchoolClassification(
    @User('school_id') schoolId: number,
    @Body() schoolData: SchoolClassification,
  ) {
    schoolId = 0;
    return await this.schoolClassification.saveSchoolClassification({
      schoolData,
      schoolId,
    });
  }
}
