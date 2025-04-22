import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }

  @MessagePattern({ cmd: 'get_chats' })
  async testDb() {
    return this.prisma.message.findMany();
  }
}
