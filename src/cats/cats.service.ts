import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { MetricsService } from '../metrics/metrics.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  private catsDatabase: Cat[] = [];

  constructor(
    @Inject(REQUEST) private request: Request,
    private metricsService: MetricsService,
    private configService: ConfigService,
  ) {}

  create(createCatDto: CreateCatDto) {
    const cat = new Cat();
    Object.assign(cat, createCatDto);
    this.catsDatabase.push(cat);
    return cat;
  }

  findAll() {
    //ConfigModule test
    console.log(this.configService.get<string>('TEST_VARIABLE'));
    //---

    const now = Date.now();
    return new Promise((resolve) => {
      setTimeout(() => {
        this.metricsService.logProvider('CatsService', {
          timeStart: now,
          delay: Date.now() - now,
        });
        resolve(this.catsDatabase);
      }, 20);
    });
  }

  findOne(id: number) {
    const now = Date.now();
    return new Promise((resolve) => {
      setTimeout(() => {
        this.metricsService.logProvider('CatsService', {
          timeStart: now,
          delay: Date.now() - now,
        });
        resolve(this.catsDatabase.find((c) => c.id === id));
      }, 20);
    });
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    const cat = this.catsDatabase.find((c) => c.id === id);
    Object.assign(
      this.catsDatabase[this.catsDatabase.findIndex((c) => c.id === id)],
      updateCatDto,
    );
    return cat;
  }

  remove(id: number) {
    this.catsDatabase = this.catsDatabase.filter((c) => c.id !== id);
  }
}
