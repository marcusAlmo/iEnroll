// apps/user-service/src/config/configuration.ts
export default () => ({
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    systemManagementQueue: 'system_management_queue',
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'system_management_queue.dlq',
  },
  // other service-specific config
});
