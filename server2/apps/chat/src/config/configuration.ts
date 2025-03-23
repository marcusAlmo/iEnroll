// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    chatQueue: 'chat_queue',
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'chat_queue.dlq',
  },
  // other service-specific config
});
