import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { Injectable, Logger } from '@nestjs/common';
import { Channel, ChannelModel, connect } from 'amqplib';
import { getAllRabbitMQQueues } from '@lib/constants/rabbit-mq.constants';

@Injectable()
export class RabbitMQHealthIndicator {
  private readonly logger = new Logger(RabbitMQHealthIndicator.name);
  private readonly queues = getAllRabbitMQQueues();
  private readonly rabbitUrl =
    process.env.RABBITMQ_URL || 'amqp://127.0.0.1:5672';

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /**
   * Performs a RabbitMQ health check.
   *
   * @param key - Health check name
   * @param options.strict - If true, fails if any queue check fails. Default is true.
   */
  async isHealthy(
    key: string,
    options: { strict?: boolean } = {},
  ): Promise<HealthIndicatorResult> {
    const strict = options.strict ?? true;
    const indicator = this.healthIndicatorService.check(key);

    let connection: ChannelModel | null = null;
    let channel: Channel | null = null;

    try {
      connection = await connect(this.rabbitUrl);
      channel = await connection.createChannel();

      const failedQueues: string[] = [];

      for (const queue of this.queues) {
        try {
          await channel.checkQueue(queue);
        } catch (queueErr) {
          const msg = `Queue "${queue}" check failed`;
          this.logger.error(
            msg,
            queueErr instanceof Error ? queueErr.stack : '',
          );
          failedQueues.push(queue);

          if (strict) {
            return indicator.down(msg);
          }
        }
      }

      if (!strict && failedQueues.length) {
        this.logger.warn(
          `Non-strict mode: some queues failed but are ignored: ${failedQueues.join(', ')}`,
        );
      }

      return indicator.up();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown RabbitMQ connection error';
      this.logger.error(
        `RabbitMQ connection failed: ${message}`,
        err instanceof Error ? err.stack : '',
      );
      return indicator.down(`Connection failed: ${message}`);
    } finally {
      try {
        if (channel) await channel.close();
        if (connection) await connection.close();
      } catch (cleanupErr) {
        this.logger.warn(
          'Error closing RabbitMQ channel/connection',
          cleanupErr,
        );
      }
    }
  }
}
