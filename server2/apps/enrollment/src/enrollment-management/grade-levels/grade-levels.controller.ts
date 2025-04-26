import { Controller } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelsService: GradeLevelsService) {}

  @MessagePattern({ cmd: 'get-grade-levels' })
  async getGradeLevels(payload: { schoolId: number }) {
    return await this.gradeLevelsService.getGradeLevels(payload.schoolId);
  }

  @MessagePattern({ cmd: 'create-update-grade-levels' })
  async createDeleteGradeLevels(payload: {
    gradeLevelOfferedId: number;
    sectionId: number;
    programname: string;
    programId: number;
    sectionName: string;
    adviser: string;
    admissionSlot: number;
    maxApplicationSlot: number;
    gradeSectionProgramId: number;
    isUpdate: boolean;
  }) {
    return await this.gradeLevelsService.createAndUpdateGradeLevel(
      payload.gradeLevelOfferedId,
      payload.sectionId,
      payload.programname,
      payload.programId,
      payload.sectionName,
      payload.adviser,
      payload.admissionSlot,
      payload.maxApplicationSlot,
      payload.gradeSectionProgramId,
      payload.isUpdate,
    );
  }

  @MessagePattern({ cmd: 'delete-grade-section' })
  async deleteGradeSection(payload: { sectionId: number }) {
    return await this.gradeLevelsService.deleteGradeSection(payload.sectionId);
  }

  @MessagePattern({ cmd: 'retrieve-programs' })
  async retrievePrograms() {
    return await this.gradeLevelsService.retrievePrograms();
  }
}
