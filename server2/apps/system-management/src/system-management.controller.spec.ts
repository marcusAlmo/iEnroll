import { Test, TestingModule } from '@nestjs/testing';
import { SystemManagementController } from './system-management.controller';

describe('SystemManagementController', () => {
  let systemManagementController: SystemManagementController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SystemManagementController],
    }).compile();

    systemManagementController = app.get<SystemManagementController>(
      SystemManagementController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(systemManagementController.getHello()).toBe('You are gay');
    });
  });
});
