import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class MetricsService {
  private cachedLogs: Record<string, any> = {};

  logRequestStarted(request: Request) {
    console.log('Started...');
    this.cachedLogs = {
      request: {
        method: request.method,
        endpoint: request.originalUrl,
      },
    };
  }

  logProvider(providerName: string, log: Record<string, any>) {
    Object.assign(this.cachedLogs, { [providerName]: log });
  }

  logRequestFinished(timestamp: number, response: Response) {
    Object.assign(this.cachedLogs, {
      response: {
        statusCode: response.statusCode,
      },
      usage: {
        startTime: timestamp,
        totalMs: Date.now() - timestamp,
      },
    });
    console.log(`After... ${Date.now() - timestamp}ms`);
  }

  sendDataToSqs() {
    console.log(this.cachedLogs);
  }
}
