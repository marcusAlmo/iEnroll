/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
  private breakers = new Map<string, CircuitBreaker>();

  createBreaker(
    name: string,
    action: Function,
    options: CircuitBreaker.Options,
  ) {
    if (!this.breakers.has(name)) {
      const breaker = new CircuitBreaker(action, options);

      // Add event listeners for logging circuit state
      breaker.on('open', () => console.warn(`${name} circuit breaker is OPEN`));
      breaker.on('halfOpen', () =>
        console.warn(`${name} circuit breaker is HALF-OPEN`),
      );
      breaker.on('close', () =>
        console.warn(`${name} circuit breaker is CLOSED`),
      );

      this.breakers.set(name, breaker);
    }

    return this.breakers.get(name)!;
  }

  getBreakerStatus(name: string) {
    return this.breakers.get(name)?.status;
  }
}
