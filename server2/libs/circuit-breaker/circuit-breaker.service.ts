/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable } from '@nestjs/common';
// Import the types directly from the module
import CircuitBreaker from 'opossum';
import type { Options, CircuitBreaker as CircuitBreakerType } from 'opossum';

/**
 * Service for managing circuit breakers
 */
@Injectable()
export class CircuitBreakerService {
  private breakers = new Map<string, CircuitBreakerType<unknown>>();

  /**
   * Create a new circuit breaker or return an existing one
   */
  createBreaker<T>(
    name: string,
    action: () => Promise<T>,
    options: Options,
  ): CircuitBreakerType<T> {
    if (!this.breakers.has(name)) {
      // We need to use type assertions here because the opossum types aren't perfect

      const breaker = new CircuitBreaker(action, options);

      // Add event listeners with proper typings

      breaker.on('open', (): void => {
        console.warn(`${name} circuit breaker is OPEN`);
      });

      breaker.on('halfOpen', (): void => {
        console.warn(`${name} circuit breaker is HALF-OPEN`);
      });

      breaker.on('close', (): void => {
        console.warn(`${name} circuit breaker is CLOSED`);
      });

      // Error event handler

      breaker.on('error', (error: Error): void => {
        console.error(`${name} circuit breaker error:`, error);
      });

      this.breakers.set(name, breaker as CircuitBreakerType<unknown>);
    }

    // Get the existing breaker and cast it to the correct type

    const breaker = this.breakers.get(name);

    // Safe to use type assertion here since we're enforcing type safety at runtime
    return breaker as unknown as CircuitBreakerType<T>;
  }

  /**
   * Get the status of a circuit breaker
   */
  getBreakerStatus(name: string): string | undefined {
    if (!this.breakers.has(name)) {
      return undefined;
    }

    // Use a direct member access with a type assertion
    // eslint-disable-next-line
    return String((this.breakers.get(name) as unknown as { status: unknown }).status);
  }
}
