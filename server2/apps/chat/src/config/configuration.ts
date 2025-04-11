import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: rabbitMqUrl,
    chatQueue: rabbitMQQueue.CHAT,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'chat_queue.dlq',
  },
  // other service-specific config
});
