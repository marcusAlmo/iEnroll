import { Controller, Get } from "@nestjs/common";

@Controller()
export class EnrollmentController {
  @Get()
  getHello(): string {
    return 'Hello my Nigga';
  }
}
