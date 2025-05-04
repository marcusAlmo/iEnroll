import { Controller } from '@nestjs/common';
import { SchoolClassificationService } from './school-classification.service';
import { MessagePattern } from '@nestjs/microservices';
import { SchoolClassification } from './interface/school-classification.interface';

@Controller('school-classification')
export class SchoolClassificationController {
  constructor(
    private readonly schoolClassification: SchoolClassificationService,
  ) {}

  @MessagePattern({ cmd: 'save-school-classification' })
  async saveSchoolClassification(payload: {
    schoolData: SchoolClassification['schoolInfoParam'];
    schoolId: number;
  }) {
    return await this.schoolClassification.saveSchoolClassification(
      payload.schoolData,
      payload.schoolId,
    );
  }

  @MessagePattern({ cmd: 'get-all-grade-levels' })
  async getAllGradesLavels(payload: { schoolId: number }) {
    return await this.schoolClassification.getAllGradesLavels(payload.schoolId);
  }
}
