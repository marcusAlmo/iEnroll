import { Transport, ClientProviderOptions } from '@nestjs/microservices';

export const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

const getRabbitMQConfig = (serviceName: string): ClientProviderOptions => {
  return {
    name: `${serviceName}_SERVICE`,
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: `${serviceName.toLowerCase()}_queue`,
      queueOptions: {
        durable: true,
        persistent: true,
      },
    },
  };
};

export const rabbitMQConstants = {
  ENROLLMENT: getRabbitMQConfig('ENROLLMENT'),
  CHAT: getRabbitMQConfig('CHAT'),
  METRICS: getRabbitMQConfig('METRICS'),
  SYSTEM_MANAGEMENT: getRabbitMQConfig('SYSTEM_MANAGEMENT'),
  AUTH: getRabbitMQConfig('AUTH'),
  // Add other services here as needed
};

export const rabbitMQQueue = {
  ENROLLMENT: 'enrollment_queue',
  CHAT: 'chat_queue',
  METRICS: 'metrics_queue',
  SYSTEM_MANAGEMENT: 'system_management_queue',
  AUTH: 'auth_queue',
};
