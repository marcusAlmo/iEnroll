import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
