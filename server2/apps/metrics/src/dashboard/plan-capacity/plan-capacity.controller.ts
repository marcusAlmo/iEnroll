import { Controller } from '@nestjs/common';
import { PlanCapacityService } from './plan-capacity.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('plan-capacity')
export class PlanCapacityController {
  constructor(private readonly planCapacityService: PlanCapacityService) {}

  @MessagePattern({ cmd: 'plan-capacity' })
  async getPlanCapacity(@Payload() payload: { schoolId: number }) {
    console.log('payload', payload);
    return await this.planCapacityService.getPlanCapacity(payload.schoolId);
  }
}
