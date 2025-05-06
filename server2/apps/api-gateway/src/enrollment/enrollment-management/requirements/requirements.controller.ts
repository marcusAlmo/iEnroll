import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { User } from '@lib/decorators/user.decorator';
import { RequirementsDTO, UpdateRequirementsDTO } from './dto/requirements.dto';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Get('retrieve')
  async getAllRequirements(@User('school_id') schoolId: number) {
    return this.requirementsService.getAllRequirements({ schoolId });
  }

  @Post('process-received-requirements')
  async processReceivedData(
    @User('school_id') schoolId: number,
    @Body() receivedData: RequirementsDTO,
  ) {
    return this.requirementsService.processReceivedData({
      schoolId,
      receivedData,
    });
  }

  @Delete('delete/:requirementId')
  async deleteRequirement(@Param('requirementId') requirementId: string) {
    const requirementIdNumber = Number(requirementId);
    return this.requirementsService.deleteRequirement({
      requirementId: requirementIdNumber,
    });
  }

  @Post('update/:requirementId')
  async updateRequirement(
    @User('school_id') schoolId: number,
    @Body() updateRequirementsDTO: UpdateRequirementsDTO,
  ) {
    return this.requirementsService.updateRequirement({
      schoolId,
      updateRequirementsDTO,
    });
  }
}
