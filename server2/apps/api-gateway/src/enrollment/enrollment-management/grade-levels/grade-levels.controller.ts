import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { User } from '@lib/decorators/user.decorator';
import { GradeLevelsDto, DeleteGradeLevelsDto } from './dto/grade-levels.dto';

@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelService: GradeLevelsService) {}

  @Get('fetch')
  async fetchGradeLevels(@User('school_id') schoolId: number) {
    schoolId = 0;
    return await this.gradeLevelService.getGradeLevels({ schoolId });
  }

  @Post('receive')
  async receiveGradeLevels(
    @User('school_id') schoolId: number,
    @Body() payload: GradeLevelsDto,
  ) {
    schoolId = 0;
    return await this.gradeLevelService.createAndUpdateGradeLevels({
      schoolId,
      payload,
    });
  }

  @Delete('delete')
  async deleteGradeLevels(
    @User('school_id') schoolId: number,
    @Body() payload: DeleteGradeLevelsDto,
  ) {
    schoolId = 0;
    return await this.gradeLevelService.deleteGradeLevels({
      schoolId,
      payload,
    });
  }

  @Get('retrieve-programs')
  async retrievePrograms() {
    return await this.gradeLevelService.retrievePrograms();
  }
}
