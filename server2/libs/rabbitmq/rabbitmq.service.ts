import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CircuitBreakerService } from '@libs/circuit-breaker/circuit-breaker.service';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly client: ClientProxy,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  async sendMessage(queue: string, message: any) {
    const breaker = await this.circuitBreakerService.createBreaker(
      queue,
      async () => {
        return await this.client.send(queue, message).toPromise();
      },
      {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000,
      },
    );

    return breaker.fire();
  }

  async close() {
    await this.client.close();
  }
}
