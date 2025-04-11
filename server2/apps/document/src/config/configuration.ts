import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: rabbitMqUrl,
    chatQueue: rabbitMQQueue.DOCUMENT,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'document_queue.dlq',
  },
  // other service-specific config
});
