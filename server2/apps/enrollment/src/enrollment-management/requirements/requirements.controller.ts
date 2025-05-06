import { Controller } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { MessagePattern } from '@nestjs/microservices';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Requirements } from './interface/requirements.interface';

@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @MessagePattern({ cmd: 'retrieve-requirements' })
  async getAllRequirements(payload: {
    schoolId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return this.requirementsService.getAllRequirements(payload.schoolId);
  }

  @MessagePattern({ cmd: 'process-received-requirements' })
  async processReceivedData(payload: {
    data: Requirements['receivedData'];
    schoolId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return this.requirementsService.processReceivedData(
      payload.data,
      payload.schoolId,
    );
  }

  @MessagePattern({ cmd: 'delete-requirement' })
  async deleteRequirement(payload: {
    requirementId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return this.requirementsService.deleteRequirement(payload.requirementId);
  }

  @MessagePattern({ cmd: 'update-requirement' })
  async updateRequirement(payload: {
    requirementId: number;
    isRequired: boolean;
  }): Promise<MicroserviceUtility['returnValue']> {
    return this.requirementsService.updateRequirement(
      payload.requirementId,
      payload.isRequired,
    );
  }
}
