import { Controller } from '@nestjs/common';
import { AssignedService } from './assigned.service';

@Controller()
export class AssignedController {
  constructor(private readonly assignedService: AssignedService) {}
}
