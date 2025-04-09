import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

describe('ChatController', () => {
  let chatController: ChatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService, PrismaService],
    }).compile();

    chatController = app.get<ChatController>(ChatController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatController.getHello()).toBe('Hello World!');
    });
  });
});
