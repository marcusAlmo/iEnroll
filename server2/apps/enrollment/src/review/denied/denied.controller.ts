import { Controller } from '@nestjs/common';
import { DeniedService } from './denied.service';

@Controller()
export class DeniedController {
  constructor(private readonly deniedService: DeniedService) {}
}
