import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: rabbitMqUrl,
    systemManagementQueue: rabbitMQQueue.SYSTEM_MANAGEMENT,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'system_management_queue.dlq',
  },
  // other service-specific config
});
