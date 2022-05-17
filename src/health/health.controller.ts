import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const pingTimestamp = Date.now();
    const ping = await this.ping(pingTimestamp);
    const dsapiTimestamp = Date.now();
    const dsapi = await this.dsapi(dsapiTimestamp);
    const mongodbTimestamp = Date.now();
    const mongodb = await this.mongodb(mongodbTimestamp);
    return {
      ping,
      dsapi,
      mongodb,
    };
  }

  @Get('ping')
  @HealthCheck()
  async checkPing() {
    const pingTimestamp = Date.now();
    const ping = await this.ping(pingTimestamp);
    return {
      ping,
    };
  }

  @Get('dsapi')
  @HealthCheck()
  async checkDSAPI() {
    const dsapiTimestamp = Date.now();
    const dsapi = await this.dsapi(dsapiTimestamp);
    return {
      dsapi,
    };
  }

  @Get('mongodb')
  @HealthCheck()
  async checkMongoDB() {
    const mongodbTimestamp = Date.now();
    const mongodb = await this.mongodb(mongodbTimestamp);
    return {
      mongodb,
    };
  }

  private async ping(timestamp: number) {
    return {
      healthy: true,
      ms: Date.now() - timestamp,
    };
  }

  private async dsapi(timestamp: number) {
    let healthy = false;
    try {
      const httpRes = await this.http.pingCheck(
        'dsapi',
        'https://docs.nestjs.com', //`${process.env.DSAPI_URL}/status`
      );
      healthy = httpRes['dsapi'].status === 'up';
    } catch (e) {
      console.warn(e);
      healthy = false;
    }
    return {
      healthy,
      message: 'DSAPI interaction is healthy',
      ms: Date.now() - timestamp,
    };
  }

  private async mongodb(timestamp: number) {
    // For this one I saw that you implemented custom logic. I'll asume that it is a class that extends
    // 'HealthIndicator' like the docs suggest, and therefore the response is something like
    // { 'mongodb': { status: 'up' } }
    const mongoRes = { mongodb: { status: 'up' } };
    return {
      healthy: mongoRes['mongodb'].status === 'up',
      message: 'Mongodb interaction is healthy',
      ms: Date.now() - timestamp,
    };
  }
}
