import { Controller } from '@nestjs/common';
import { EnrolledService } from './enrolled.service';

@Controller()
export class EnrolledController {
  constructor(private readonly enrolledService: EnrolledService) {}
}
