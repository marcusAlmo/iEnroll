import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: rabbitMqUrl,
    metricsQueue: rabbitMQQueue.METRICS,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'metrics_queue.dlq',
  },
  // other service-specific config
});
