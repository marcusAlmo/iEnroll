import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CircuitBreakerService } from 'libs/circuit-breaker/circuit-breaker.service';
import type CircuitBreaker from 'opossum';

@Injectable()
export class RabbitMQService {
  constructor(
    private readonly client: ClientProxy,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  async sendMessage(queue: string, message: any): Promise<any> {
    // eslint-disable-next-line
    const breaker: CircuitBreaker<any> = await this.circuitBreakerService.createBreaker(
      queue, // eslint-disable-line
      async () => { // eslint-disable-line
        return await this.client.send(queue, message).toPromise(); // eslint-disable-line
      }, // eslint-disable-line
      { // eslint-disable-line
        timeout: 5000, // eslint-disable-line
        errorThresholdPercentage: 50, // eslint-disable-line
        resetTimeout: 30000, // eslint-disable-line
      }, // eslint-disable-line
    ); // eslint-disable-line

    return breaker.fire();
  }

  async close() {
    await this.client.close();
  }
}
