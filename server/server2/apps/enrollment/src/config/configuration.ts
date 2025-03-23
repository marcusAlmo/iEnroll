// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    enrollmentQueue: 'enrollment_queue',
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'enrollment_queue.dlq',
  },
  // other service-specific config
});
