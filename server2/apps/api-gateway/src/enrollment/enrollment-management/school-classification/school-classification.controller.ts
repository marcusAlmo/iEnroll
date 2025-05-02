import { Controller, Get, Post, Body } from '@nestjs/common';
import { SchoolClassificationService } from './school-classification.service';
import { User } from '@lib/decorators/user.decorator';
import { SchoolClassification } from './dto/school-classification.dto';

@Controller('school-classification')
export class SchoolClassificationController {
  constructor(
    private readonly schoolClassification: SchoolClassificationService,
  ) {}

  @Post('save')
  async saveSchoolClassification(
    @User('school_id') schoolId: number,
    @Body() schoolData: SchoolClassification,
  ) {
    schoolId = 686042;
    console.log(schoolData);
    return await this.schoolClassification.saveSchoolClassification({
      schoolData,
      schoolId,
    });
  }

  @Get('retrieve-all-grade-levels')
  async getAllGradesLavels(@User('school_id') schoolId: number) {
    schoolId = 686042;
    return await this.schoolClassification.getAllGradesLavels({
      schoolId,
    });
  }
}
