import { Controller, Get } from '@nestjs/common';
import { PlanCapacityService } from './plan-capacity.service';
import { User } from '@lib/decorators/user.decorator';

@Controller('metrics/plan-capacity')
//@UseGuards(JwtAuthGuard)
export class PlanCapacityController {
  constructor(private readonly planCapacityService: PlanCapacityService) {}

  @Get('collection')
  async getPlanCapacity(@User('school_id') schoolId: number) {
    schoolId = 762306;
    return await this.planCapacityService.getPlanCapacity({ schoolId });
  }
}
