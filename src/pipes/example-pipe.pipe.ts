import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { MetricsService } from '../metrics/metrics.service';

@Injectable({ scope: Scope.REQUEST })
export class ExamplePipe implements PipeTransform {
  constructor(private metricsService: MetricsService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    this.metricsService.logProvider('ExamplePipe', { data: 'data' });
    return value;
  }
}
