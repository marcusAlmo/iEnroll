// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    userQueue: 'user_queue',
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'user_queue.dlq',
  },
  // other service-specific config
});
