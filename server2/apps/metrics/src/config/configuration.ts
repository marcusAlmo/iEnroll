// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    metricsQueue: 'metrics_queue',
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'metrics_queue.dlq',
  },
  // other service-specific config
});
