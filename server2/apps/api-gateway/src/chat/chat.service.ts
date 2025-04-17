import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
// metrics.service.ts
@Injectable()
export class ChatService {
  constructor(@Inject('CHAT_SERVICE') private readonly client: ClientProxy) {}

  async getChats() {
    const result: number = await lastValueFrom(
      this.client.send({ cmd: 'get_chats' }, {}),
    );
    return result;
  }
}
