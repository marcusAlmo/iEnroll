// rabbitmq.health.ts
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { Channel, connect } from 'amqplib';

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    // In your RabbitMQ health check
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://127.0.0.1:5672';
    try {
      const connection = await connect(rabbitUrl);
      const channel: Channel = await connection.createChannel();
      await channel.checkQueue('chat_queue');
      await channel.close();
      await connection.close();
      return this.getStatus(key, true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return this.getStatus(key, false, { message });
    }
  }
}
