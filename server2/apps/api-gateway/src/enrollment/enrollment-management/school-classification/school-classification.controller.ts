import { Controller, Get, Post, Body } from '@nestjs/common';
import { SchoolClassificationService } from './school-classification.service';
import { User } from '@lib/decorators/user.decorator';
import { SchoolClassification } from './dto/school-classification.dto';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('school-classification')
@UseGuards(JwtAuthGuard)
export class SchoolClassificationController {
  constructor(
    private readonly schoolClassification: SchoolClassificationService,
  ) {}

  @Post('save')
  async saveSchoolClassification(
    @User('school_id') schoolId: number,
    @Body() schoolData: SchoolClassification,
  ) {
    return await this.schoolClassification.saveSchoolClassification({
      schoolData,
      schoolId,
    });
  }

  @Get('retrieve-all-grade-levels')
  async getAllGradesLavels(@User('school_id') schoolId: number) {
    return await this.schoolClassification.getAllGradesLavels({
      schoolId,
    });
  }
}
