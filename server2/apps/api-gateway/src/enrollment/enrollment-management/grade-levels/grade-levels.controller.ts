import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { User } from '@lib/decorators/user.decorator';
import { CreateSectionDTO } from './dto/grade-levels.dto';

@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelService: GradeLevelsService) {}

  @Get('fetch')
  async fetchGradeLevels(@User('school_id') schoolId: number) {
    return await this.gradeLevelService.getGradeLevels({ schoolId });
  }

  @Post('update/:sectionId')
  async receiveGradeLevels(
    @User('school_id') schoolId: number,
    @Param('sectionId') sectionId: string,
    @Body() payload: CreateSectionDTO,
  ) {
    const numberSectionId: number = Number(sectionId);
    return await this.gradeLevelService.createAndUpdateGradeLevels({
      schoolId,
      payload,
      sectionId: numberSectionId,
    });
  }

  @Post('create') // For creation
  async createGradeLevel(
    @User('school_id') schoolId: number,
    @Body() payload: CreateSectionDTO,
  ) {
    return await this.gradeLevelService.createAndUpdateGradeLevels({
      schoolId,
      payload,
      sectionId: undefined,
    });
  }

  @Delete('delete/:sectionId')
  async deleteGradeLevels(@Param('sectionId') sectionId: number) {
    return await this.gradeLevelService.deleteGradeLevels({
      sectionId,
    });
  }

  @Get('retrieve-programs')
  async retrievePrograms() {
    return await this.gradeLevelService.retrievePrograms();
  }
}
