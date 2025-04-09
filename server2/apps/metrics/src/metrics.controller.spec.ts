import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';

describe('MetricsController', () => {
  let metricsController: MetricsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
    }).compile();

    metricsController = app.get<MetricsController>(MetricsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(metricsController.getHello()).toBe(
        'Other people achieved success at a young age, it is too late, give up',
      );
    });
  });
});
