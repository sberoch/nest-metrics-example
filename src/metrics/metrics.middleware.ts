import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly authService: AuthService,
  ) {}

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const now = Date.now();
    await this.authService.doSomething();
    this.metricsService.logRequestStarted(request);

    response.on('finish', () => {
      this.metricsService.logRequestFinished(now, response);
      this.metricsService.sendDataToSqs();
    });

    next();
  }
}
