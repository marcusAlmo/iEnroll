import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

// metrics.controller.ts
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChats() {
    return this.chatService.getChats();
  }
}
