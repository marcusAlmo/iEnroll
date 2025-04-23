import { Transport, ClientProviderOptions } from '@nestjs/microservices';

// Use environment variable or fallback to localhost
export const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

// Centralized list of service names (to avoid repetition and typos)
const serviceNames = [
  'ENROLLMENT',
  'CHAT',
  'METRICS',
  'SYSTEM_MANAGEMENT',
  'AUTH',
  'FILE',
  'IMAGE',
] as const;

// Helper function to generate RabbitMQ config for a given service
const getRabbitMQConfig = (serviceName: string): ClientProviderOptions => ({
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
});

// Construct service constants dynamically
export const rabbitMQConstants: Record<
  (typeof serviceNames)[number],
  ClientProviderOptions
> = serviceNames.reduce(
  (acc, name) => {
    acc[name] = getRabbitMQConfig(name);
    return acc;
  },
  {} as Record<string, ClientProviderOptions>,
);

// Construct queue names dynamically
export const rabbitMQQueue: Record<(typeof serviceNames)[number], string> =
  serviceNames.reduce(
    (acc, name) => {
      acc[name] = `${name.toLowerCase()}_queue`;
      return acc;
    },
    {} as Record<string, string>,
  );

export const getAllRabbitMQQueues = () =>
  serviceNames.map((s) => `${s.toLowerCase()}_queue` as const);
