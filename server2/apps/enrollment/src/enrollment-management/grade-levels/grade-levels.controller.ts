import { Controller } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { MessagePattern } from '@nestjs/microservices';
import { GradeLevels } from './interface/grade-levels.interface';

@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelsService: GradeLevelsService) {}

  @MessagePattern({ cmd: 'fetch-grade-levels-sections' })
  async getGradeLevels(payload: { schoolId: number }) {
    return await this.gradeLevelsService.getGradeLevels(payload.schoolId);
  }

  @MessagePattern({ cmd: 'create-update-grade-levels' })
  async createDeleteGradeLevels(payload: {
    schoolId: number;
    payload: GradeLevels['receivedData'];
    sectionId: number | undefined;
  }) {
    return await this.gradeLevelsService.createAndUpdateGradeLevel(
      payload.schoolId,
      payload.payload.gradeLevelOfferedId,
      payload.sectionId,
      payload.payload.programName,
      payload.payload.programId,
      payload.payload.sectionName,
      payload.payload.adviser,
      payload.payload.admissionSlot,
      payload.payload.maxApplicationSlot,
      payload.payload.gradeSectionProgramId,
      payload.payload.isUpdate,
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
