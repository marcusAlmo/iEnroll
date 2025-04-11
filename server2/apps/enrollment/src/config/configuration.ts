import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: rabbitMqUrl,
    enrollmentQueue: rabbitMQQueue.ENROLLMENT,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'enrollment_queue.dlq',
  },
  // other service-specific config
});
