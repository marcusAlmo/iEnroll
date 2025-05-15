import { Controller, Get, UseGuards } from '@nestjs/common';
import { PlanCapacityService } from './plan-capacity.service';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('metrics/plan-capacity')
@UseGuards(JwtAuthGuard)
export class PlanCapacityController {
  constructor(private readonly planCapacityService: PlanCapacityService) {}

  @Get('collection')
  async getPlanCapacity(@User('school_id') schoolId: number) {
    return await this.planCapacityService.getPlanCapacity({ schoolId });
  }
}
