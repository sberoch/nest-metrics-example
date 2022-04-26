import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsMiddleware } from './metrics/metrics.middleware';
import { MetricsModule } from './metrics/metrics.module';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ExamplePipe } from './pipes/example-pipe.pipe';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MetricsModule,
    CatsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ExamplePipe,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
