import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// metrics.service.ts
@Injectable()
export class ChatService {
  constructor(@Inject('CHAT_SERVICE') private readonly client: ClientProxy) {}

  getChats() {
    return this.client.send({ cmd: 'get_chats' }, {});
  }
}
