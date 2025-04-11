import { Transport, ClientProviderOptions } from '@nestjs/microservices';

const getRabbitMQConfig = (serviceName: string): ClientProviderOptions => {
  const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
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
