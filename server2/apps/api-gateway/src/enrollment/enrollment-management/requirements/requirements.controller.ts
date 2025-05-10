import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { User } from '@lib/decorators/user.decorator';
import { RequirementsDTO, UpdateRequirementDto } from './dto/requirements.dto';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Get('retrieve')
  async getAllRequirements(@User('school_id') schoolId: number) {
    schoolId = 686042;
    return this.requirementsService.getAllRequirements({ schoolId });
  }

  @Post('process-received-requirements')
  async processReceivedData(@Body() receivedData: RequirementsDTO) {
    console.log(receivedData);
    return this.requirementsService.processReceivedData({
      data: receivedData,
    });
  }

  @Delete('delete/:requirementId')
  async deleteRequirement(@Param('requirementId') requirementId: string) {
    const requirementIdNumber = Number(requirementId);
    return this.requirementsService.deleteRequirement({
      requirementId: requirementIdNumber,
    });
  }

  @Put('update')
  async updateRequirement(@Body() data: UpdateRequirementDto) {
    console.log(data);
    return this.requirementsService.updateRequirement({
      data: data.data,
    });
  }
}
