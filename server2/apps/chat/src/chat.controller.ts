import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }

  @Get('test-db')
  async testDb() {
    return this.prisma.message.findMany();
  }
}
