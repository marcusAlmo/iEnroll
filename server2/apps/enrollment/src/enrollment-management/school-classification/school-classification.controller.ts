import { Controller } from '@nestjs/common';
import { SchoolClassificationService } from './school-classification.service';
import { MessagePattern } from '@nestjs/microservices';
import { SchoolClassification } from './interface/school-classification.interface';

@Controller('school-classification')
export class SchoolClassificationController {
  constructor(
    private readonly schoolClassification: SchoolClassificationService,
  ) {}

  @MessagePattern({ cmd: 'get-school-classification' })
  async getSchoolClassification(payload: { schoolId: number }) {
    return await this.schoolClassification.getShoolClassifications(
      payload.schoolId,
    );
  }

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
}
